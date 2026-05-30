import { randomUUID } from 'node:crypto'
import type { Config } from '@netlify/functions'
import { getMastodonApp, getMastodonCode, deleteMastodonCode, setMastodonToken } from './lib/blobs.js'

const CODE_TTL_MS = 5 * 60 * 1000

function jsonError(error: string, status: number): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  let body: Record<string, string>
  const contentType = req.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    body = await req.json() as Record<string, string>
  } else {
    const text = await req.text()
    body = Object.fromEntries(new URLSearchParams(text))
  }

  const { client_id: clientId, client_secret: clientSecret, code, grant_type: grantType } = body

  if (grantType !== 'authorization_code') {
    return jsonError('unsupported_grant_type', 400)
  }

  const app = await getMastodonApp(clientId)
  if (!app || app.clientSecret !== clientSecret) {
    return jsonError('invalid_client', 401)
  }

  const codeRecord = await getMastodonCode(code)
  if (!codeRecord || codeRecord.clientId !== clientId) {
    return jsonError('invalid_grant', 400)
  }

  const age = Date.now() - new Date(codeRecord.createdAt).getTime()
  if (age > CODE_TTL_MS) {
    await deleteMastodonCode(code)
    return jsonError('invalid_grant', 400)
  }

  await deleteMastodonCode(code)

  const token = randomUUID()
  await setMastodonToken({ token, clientId, createdAt: new Date().toISOString() })

  return new Response(
    JSON.stringify({
      access_token: token,
      token_type: 'Bearer',
      scope: 'read write',
      created_at: Math.floor(Date.now() / 1000),
    }),
    { headers: { 'Content-Type': 'application/json' } },
  )
}

export const config: Config = {
  path: '/oauth/token',
}
