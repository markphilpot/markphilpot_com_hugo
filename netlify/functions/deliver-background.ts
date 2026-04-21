import type { Config } from '@netlify/functions'
import { fetchFeed } from './lib/feed.js'
import { getDelivered, setDelivered, listFollowers } from './lib/blobs.js'
import { formatNote } from './lib/activitypub.js'
import { signRequest } from './lib/crypto.js'

export default async (req: Request): Promise<Response> => {
  const privateKeyPem = (process.env.AP_PRIVATE_KEY_PEM ?? '').replace(/\\n/g, '\n')
  if (!privateKeyPem) {
    console.error('AP_PRIVATE_KEY_PEM not configured — skipping delivery')
    return new Response('', { status: 202 })
  }

  // Netlify doesn't allow setting of headers... skip this check for now
  // const deliverSecret = process.env.AP_DELIVER_SECRET
  // if (deliverSecret) {
  //   const providedSecret = req.headers.get('x-deliver-secret')
  //   if (providedSecret !== deliverSecret) {
  //     console.warn('Deliver endpoint: invalid or missing secret — ignoring request (')
  //     return new Response('', { status: 202 })
  //   }
  // }

  let posts, delivered: string[]
  try {
    ;[posts, delivered] = await Promise.all([fetchFeed(), getDelivered()])
  } catch (err) {
    console.error('Failed to load feed or delivered state:', err)
    return new Response('', { status: 202 })
  }

  // First-run: seed the delivered list with all existing posts without sending them.
  // Prevents historical posts from flooding followers when ActivityPub is first deployed.
  if (delivered.length === 0 && posts.length > 0) {
    console.log(`First run: seeding ${posts.length} existing posts as delivered without sending`)
    await setDelivered(posts.map((p) => p.url))
    return new Response('', { status: 202 })
  }

  const deliveredSet = new Set(delivered)
  const newPosts = posts.filter((p) => !deliveredSet.has(p.url))

  if (newPosts.length === 0) {
    console.log('No new posts to deliver')
    return new Response('', { status: 202 })
  }

  let followers
  try {
    followers = await listFollowers()
  } catch (err) {
    console.error('Failed to load followers:', err)
    return new Response('', { status: 202 })
  }

  if (followers.length === 0) {
    console.log('No followers yet — marking posts as delivered')
    const allDelivered = [...delivered, ...newPosts.map((p) => p.url)]
    await setDelivered(allDelivered.slice(-500))
    return new Response('', { status: 202 })
  }

  // Deduplicate inboxes: prefer sharedInboxUrl to reduce per-instance requests
  const uniqueInboxes = [
    ...new Set(followers.map((f) => f.sharedInboxUrl ?? f.inboxUrl)),
  ]

  for (const post of newPosts) {
    const note = formatNote(post)
    const body = JSON.stringify(note)

    for (const inboxUrl of uniqueInboxes) {
      try {
        const headers = signRequest('POST', inboxUrl, body, privateKeyPem)
        const res = await fetch(inboxUrl, { method: 'POST', headers, body })
        if (!res.ok) {
          console.error(`Delivery failed → ${inboxUrl}: HTTP ${res.status}`)
        } else {
          console.log(`Delivered: ${post.url} → ${inboxUrl}`)
        }
      } catch (err) {
        console.error(`Delivery error → ${inboxUrl}:`, err)
      }
    }
  }

  const allDelivered = [...delivered, ...newPosts.map((p) => p.url)]
  await setDelivered(allDelivered.slice(-500))
  console.log(`Done. Delivered ${newPosts.length} new post(s) to ${uniqueInboxes.length} inbox(es).`)

  return new Response('', { status: 202 })
}

export const config: Config = {
  path: '/ap/deliver',
  type: 'background',
}
