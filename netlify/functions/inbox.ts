import { randomUUID } from 'node:crypto'
import type { Config } from '@netlify/functions'
import { verifySignature, signRequest } from './lib/crypto.js'
import { setFollower, removeFollower } from './lib/blobs.js'
import type { FollowerRecord } from './lib/types.js'

const ACTOR_URL = 'https://markphilpot.com/ap/actor'

export default async (req: Request): Promise<Response> => {
  console.log('inbox:', req.method, req.url)

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const privateKeyPem = process.env.AP_PRIVATE_KEY_PEM
  if (!privateKeyPem) {
    return new Response('AP_PRIVATE_KEY_PEM not configured', { status: 500 })
  }

  // Collect headers as lowercase Record for signature verification
  const headers: Record<string, string> = {}
  req.headers.forEach((value, key) => { headers[key.toLowerCase()] = value })

  const url = new URL(req.url)
  const valid = await verifySignature('POST', url.pathname, headers)
  if (!valid) {
    console.warn('inbox: invalid signature from', headers['host'] ?? '?', 'sig:', headers['signature']?.slice(0, 80))
    return new Response('Invalid signature', { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  console.log('inbox: activity type', body.type)

  if (body.type === 'Follow') {
    return handleFollow(body, privateKeyPem)
  }

  if (
    body.type === 'Undo' &&
    typeof body.object === 'object' &&
    body.object !== null &&
    (body.object as Record<string, unknown>).type === 'Follow'
  ) {
    return handleUnfollow(body)
  }

  // All other activities: acknowledge and ignore
  return new Response('', { status: 200 })
}

async function handleFollow(
  activity: Record<string, unknown>,
  privateKeyPem: string,
): Promise<Response> {
  const actorId = typeof activity.actor === 'string' ? activity.actor : null
  if (!actorId) return new Response('Missing actor', { status: 400 })

  // Fetch the follower's actor document to get their inbox URL
  let followerActor: { inbox: string; endpoints?: { sharedInbox?: string } }
  try {
    const res = await fetch(actorId, { headers: { Accept: 'application/activity+json' } })
    if (!res.ok) return new Response('Could not fetch actor', { status: 400 })
    followerActor = await res.json()
  } catch {
    return new Response('Could not fetch actor', { status: 400 })
  }

  if (!followerActor.inbox || typeof followerActor.inbox !== 'string') {
    return new Response('Actor document missing inbox', { status: 400 })
  }

  const record: FollowerRecord = {
    actorId,
    inboxUrl: followerActor.inbox,
    sharedInboxUrl: followerActor.endpoints?.sharedInbox,
    followedAt: new Date().toISOString(),
  }
  await setFollower(record)

  // Send Accept activity back to the follower's inbox
  const accept = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Accept',
    id: `https://markphilpot.com/ap/activities/${randomUUID()}`,
    actor: ACTOR_URL,
    to: [actorId],
    object: activity,
  }
  const acceptBody = JSON.stringify(accept)
  const signedHeaders = signRequest('POST', record.inboxUrl, acceptBody, privateKeyPem)

  try {
    const acceptRes = await fetch(record.inboxUrl, { method: 'POST', headers: signedHeaders, body: acceptBody })
    if (!acceptRes.ok) {
      console.error('Accept rejected by', record.inboxUrl, acceptRes.status, await acceptRes.text().catch(() => ''))
    }
  } catch (err) {
    // Log but don't fail — follower is stored; Accept delivery is best-effort
    console.error('Failed to send Accept to', record.inboxUrl, err)
  }

  return new Response('', { status: 200 })
}

async function handleUnfollow(activity: Record<string, unknown>): Promise<Response> {
  const actorId = typeof activity.actor === 'string' ? activity.actor : null
  if (!actorId) {
    console.warn('Undo/Follow missing actor field — ignoring')
    return new Response('', { status: 200 })
  }
  await removeFollower(actorId)
  return new Response('', { status: 200 })
}

export const config: Config = {
  path: '/ap/inbox',
}
