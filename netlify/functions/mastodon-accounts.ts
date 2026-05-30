import type { Config } from '@netlify/functions'
import { verifyToken } from './lib/blobs.js'

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

  return new Response(
    JSON.stringify({
      id: '1',
      username: 'self',
      acct: 'self',
      display_name: 'Mark Philpot',
      url: `https://${domain}`,
      avatar: `https://${domain}/apple-touch-icon.png`,
      avatar_static: `https://${domain}/apple-touch-icon.png`,
      header: '',
      header_static: '',
      followers_count: 0,
      following_count: 0,
      statuses_count: 0,
      created_at: '2020-01-01T00:00:00.000Z',
      bot: false,
      group: false,
      discoverable: true,
      locked: false,
      note: '',
      emojis: [],
      fields: [],
      source: { privacy: 'public', sensitive: false, language: null, note: '', fields: [] },
    }),
    { headers: { 'Content-Type': 'application/json' } },
  )
}

export const config: Config = {
  path: '/api/v1/accounts/verify_credentials',
}
