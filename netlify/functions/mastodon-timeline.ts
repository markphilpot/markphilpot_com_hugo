import type { Config } from '@netlify/functions'
import { verifyToken } from './lib/blobs.js'
import { fetchFeed } from './lib/feed.js'
import { feedPostToStatus } from './lib/mastodon.js'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 40

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!token) return new Response('Unauthorized', { status: 401 })

  const record = await verifyToken(token)
  if (!record) return new Response('Unauthorized', { status: 401 })

  const domain = process.env.AP_MASTODON_DOMAIN ?? 'markphilpot.com'
  const url = new URL(req.url)
  const maxId = url.searchParams.get('max_id') ?? null
  const limitParam = parseInt(url.searchParams.get('limit') ?? '', 10)
  const limit = isNaN(limitParam) ? DEFAULT_LIMIT : Math.min(limitParam, MAX_LIMIT)

  let posts
  try {
    posts = await fetchFeed(`https://${domain}`)
  } catch (err) {
    const cause = err instanceof Error ? (err as NodeJS.ErrnoException).cause : undefined
    console.error('mastodon-timeline: fetchFeed failed', err, 'cause:', cause)
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  console.log('mastodon-timeline: fetched %d posts', posts.length)

  const statuses = posts
    .map((p) => feedPostToStatus(p, domain))
    .sort((a, b) => (BigInt(b.id) > BigInt(a.id) ? 1 : -1))

  const filtered = maxId
    ? statuses.filter((s) => BigInt(s.id) < BigInt(maxId))
    : statuses

  return new Response(JSON.stringify(filtered.slice(0, limit)), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config: Config = {
  path: '/api/v1/timelines/home',
}
