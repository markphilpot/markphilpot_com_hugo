import type { Config } from '@netlify/functions'
import { createHmac } from 'node:crypto'
import { validateGhostJWT } from './lib/ghost-auth.js'

function debugJWT(authHeader: string): { ok: boolean; fail?: string; header?: unknown; payload?: unknown; kidMatch?: boolean; audOk?: boolean; sigOk?: boolean } {
  if (!authHeader.startsWith('Ghost ')) return { ok: false, fail: 'no_ghost_prefix', header: authHeader.slice(0, 20) }
  const token = authHeader.slice(6).trim()
  const parts = token.split('.')
  if (parts.length !== 3) return { ok: false, fail: 'wrong_part_count', header: parts.length }

  let header: unknown, payload: unknown
  try {
    header = JSON.parse(Buffer.from(parts[0], 'base64url').toString())
    payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
  } catch { return { ok: false, fail: 'decode_error' } }

  const apiKey = process.env.GHOST_ADMIN_API_KEY ?? ''
  const colonIdx = apiKey.indexOf(':')
  const id = colonIdx !== -1 ? apiKey.slice(0, colonIdx) : ''
  const secret = colonIdx !== -1 ? apiKey.slice(colonIdx + 1) : ''
  const h = header as Record<string, unknown>
  const p = payload as Record<string, unknown>

  const kidMatch = h['kid'] === id
  const audOk = p['aud'] === '/admin/'
  const expOk = typeof p['exp'] === 'number' && p['exp'] >= Math.floor(Date.now() / 1000)

  let sigOk = false
  if (secret) {
    const expected = createHmac('sha256', Buffer.from(secret, 'hex')).update(`${parts[0]}.${parts[1]}`).digest('base64url')
    sigOk = expected === parts[2]
  }

  const fail = !kidMatch ? 'kid_mismatch' : !audOk ? 'aud_mismatch' : !expOk ? 'expired' : !sigOk ? 'sig_mismatch' : undefined
  return { ok: !fail, fail, header, payload, kidMatch, audOk, sigOk }
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const authHeader = req.headers.get('authorization') ?? ''
  if (!validateGhostJWT(authHeader)) {
    const debug = debugJWT(authHeader)
    return new Response(JSON.stringify({ error: 'Unauthorized', debug }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const domain = process.env.AP_MASTODON_DOMAIN ?? 'markphilpot.com'

  return new Response(
    JSON.stringify({
      site: {
        title: 'Mark Philpot',
        description: '',
        logo: null,
        icon: `https://${domain}/apple-touch-icon.png`,
        accent_color: null,
        locale: 'en',
        url: `https://${domain}`,
        version: '5.0.0',
      },
    }),
    { headers: { 'Content-Type': 'application/json' } },
  )
}

export const config: Config = {
  path: ['/ghost/api/v4/admin/site/', '/ghost/api/admin/site/'],
}
