import { randomUUID } from 'node:crypto'
import type { Config } from '@netlify/functions'
import { setMastodonApp } from './lib/blobs.js'
import { parseBody } from './lib/parse.js'

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const body = await parseBody(req)
  const clientName = body['client_name'] ?? 'unknown'
  const redirectUri = body['redirect_uris'] ?? ''
  const clientId = randomUUID()
  const clientSecret = randomUUID()

  // console.log('mastodon-apps: registering app name=%s redirect=%s', clientName, redirectUri)

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
