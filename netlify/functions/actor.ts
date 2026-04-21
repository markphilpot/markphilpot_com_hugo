import type { Config } from '@netlify/functions'

const ACTOR_URL = 'https://markphilpot.com/ap/actor'

export default async (_req: Request): Promise<Response> => {
  const publicKeyB64 = process.env.AP_PUBLIC_KEY_PEM
  if (!publicKeyB64) {
    return new Response('AP_PUBLIC_KEY_PEM not configured', { status: 500 })
  }
  const publicKeyPem = Buffer.from(publicKeyB64, 'base64').toString('utf8')

  const actor = {
    '@context': [
      'https://www.w3.org/ns/activitystreams',
      'https://w3id.org/security/v1',
    ],
    type: 'Person',
    id: ACTOR_URL,
    preferredUsername: 'self',
    name: 'Mark Philpot',
    summary: 'Personal blog — posts and micro posts at markphilpot.com',
    url: 'https://markphilpot.com',
    inbox: 'https://markphilpot.com/ap/inbox',
    outbox: 'https://markphilpot.com/ap/outbox',
    followers: 'https://markphilpot.com/ap/followers',
    manuallyApprovesFollowers: false,
    icon: {
      type: 'Image',
      mediaType: 'image/png',
      url: 'https://markphilpot.com/apple-touch-icon.png',
    },
    publicKey: {
      id: `${ACTOR_URL}#main-key`,
      owner: ACTOR_URL,
      publicKeyPem,
    },
  }

  return new Response(JSON.stringify(actor), {
    headers: { 'Content-Type': 'application/activity+json' },
  })
}

export const config: Config = {
  path: '/ap/actor',
}
