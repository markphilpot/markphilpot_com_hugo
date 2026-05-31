import { createHmac } from 'node:crypto'

export function validateGhostJWT(authHeader: string): boolean {
  if (!authHeader.startsWith('Ghost ')) {
    console.log('ghost-auth: missing Ghost prefix, got:', authHeader.slice(0, 20))
    return false
  }
  const token = authHeader.slice(6).trim()

  const apiKey = process.env.GHOST_ADMIN_API_KEY ?? ''
  const colonIdx = apiKey.indexOf(':')
  if (colonIdx === -1) {
    console.log('ghost-auth: GHOST_ADMIN_API_KEY missing or has no colon')
    return false
  }
  const id = apiKey.slice(0, colonIdx)
  const secret = apiKey.slice(colonIdx + 1)
  if (!id || !secret) {
    console.log('ghost-auth: id or secret empty after split')
    return false
  }

  const parts = token.split('.')
  if (parts.length !== 3) {
    console.log('ghost-auth: JWT has wrong number of parts:', parts.length)
    return false
  }

  let header: Record<string, unknown>
  let payload: Record<string, unknown>
  try {
    header = JSON.parse(Buffer.from(parts[0], 'base64url').toString())
    payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
  } catch {
    console.log('ghost-auth: failed to decode JWT header/payload')
    return false
  }

  console.log('ghost-auth: header:', JSON.stringify(header))
  console.log('ghost-auth: payload:', JSON.stringify(payload))
  console.log('ghost-auth: configured id:', id, '| kid in token:', header['kid'])

  if (header['alg'] !== 'HS256' || header['kid'] !== id) {
    console.log('ghost-auth: alg/kid mismatch — alg:', header['alg'], 'kid:', header['kid'], 'expected id:', id)
    return false
  }
  if (payload['aud'] !== '/admin/') {
    console.log('ghost-auth: aud mismatch — got:', JSON.stringify(payload['aud']), 'expected: "/admin/"')
    return false
  }
  if (typeof payload['exp'] !== 'number' || payload['exp'] < Math.floor(Date.now() / 1000)) {
    console.log('ghost-auth: exp invalid or expired — exp:', payload['exp'], 'now:', Math.floor(Date.now() / 1000))
    return false
  }

  const signingInput = `${parts[0]}.${parts[1]}`
  const expected = createHmac('sha256', Buffer.from(secret, 'hex'))
    .update(signingInput)
    .digest('base64url')

  if (expected !== parts[2]) {
    console.log('ghost-auth: signature mismatch')
    return false
  }

  return true
}
