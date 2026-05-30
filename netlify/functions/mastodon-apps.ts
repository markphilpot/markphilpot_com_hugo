import { randomUUID } from 'node:crypto'
import type { Config } from '@netlify/functions'
import { setMastodonApp } from './lib/blobs.js'

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

  const clientName = body['client_name'] ?? 'unknown'
  const redirectUri = body['redirect_uris'] ?? ''
  const clientId = randomUUID()
  const clientSecret = randomUUID()

  await setMastodonApp({
    clientId,
    clientSecret,
    name: clientName,
    redirectUri,
    createdAt: new Date().toISOString(),
  })

  return new Response(
    JSON.stringify({
      id: clientId,
      name: clientName,
      website: null,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
      vapid_key: '',
    }),
    { headers: { 'Content-Type': 'application/json' } },
  )
}

export const config: Config = {
  path: '/api/v1/apps',
}
