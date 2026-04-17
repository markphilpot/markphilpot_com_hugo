import type { Config } from '@netlify/functions'

export default async (_req: Request): Promise<Response> =>
  new Response(
    JSON.stringify({
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: 'OrderedCollection',
      id: 'https://markphilpot.com/ap/outbox',
      totalItems: 0,
      orderedItems: [],
    }),
    { headers: { 'Content-Type': 'application/activity+json' } },
  )

export const config: Config = {
  path: '/ap/outbox',
}
