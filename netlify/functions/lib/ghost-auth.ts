import { createHmac } from 'node:crypto'

export function validateGhostJWT(authHeader: string): boolean {
  if (!authHeader.startsWith('Ghost ')) return false
  const token = authHeader.slice(6).trim()

  const apiKey = process.env.GHOST_ADMIN_API_KEY ?? ''
  const colonIdx = apiKey.indexOf(':')
  if (colonIdx === -1) return false
  const id = apiKey.slice(0, colonIdx)
  const secret = apiKey.slice(colonIdx + 1)
  if (!id || !secret) return false

  const parts = token.split('.')
  if (parts.length !== 3) return false

  let header: Record<string, unknown>
  let payload: Record<string, unknown>
  try {
    header = JSON.parse(Buffer.from(parts[0], 'base64url').toString())
    payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
  } catch {
    return false
  }

  if (header['alg'] !== 'HS256' || header['kid'] !== id) return false
  if (payload['aud'] !== '/admin/') return false
  if (typeof payload['exp'] !== 'number' || payload['exp'] < Math.floor(Date.now() / 1000)) return false

  const signingInput = `${parts[0]}.${parts[1]}`
  const expected = createHmac('sha256', Buffer.from(secret, 'hex'))
    .update(signingInput)
    .digest('base64url')

  return expected === parts[2]
}
