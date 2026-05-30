import { randomUUID } from 'node:crypto'
import type { Config } from '@netlify/functions'
import { getMastodonApp, setMastodonCode } from './lib/blobs.js'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderForm(params: {
  clientId: string
  redirectUri: string
  state: string
  error?: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Authorize</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 400px; margin: 4rem auto; padding: 1rem; }
    label { display: block; margin-bottom: 0.5rem; }
    input[type="password"] { width: 100%; padding: 0.5rem; margin-bottom: 1rem; box-sizing: border-box; }
    button { padding: 0.5rem 1.5rem; }
    .error { color: red; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <h1>Authorize</h1>
  ${params.error ? `<p class="error">${escapeHtml(params.error)}</p>` : ''}
  <form method="POST">
    <input type="hidden" name="client_id" value="${escapeHtml(params.clientId)}" />
    <input type="hidden" name="redirect_uri" value="${escapeHtml(params.redirectUri)}" />
    <input type="hidden" name="state" value="${escapeHtml(params.state)}" />
    <label for="password">Password</label>
    <input type="password" id="password" name="password" autofocus required />
    <button type="submit">Authorize</button>
  </form>
</body>
</html>`
}

export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url)

  if (req.method === 'GET') {
    const clientId = url.searchParams.get('client_id') ?? ''
    const redirectUri = url.searchParams.get('redirect_uri') ?? ''
    const state = url.searchParams.get('state') ?? ''
    const scope = url.searchParams.get('scope') ?? ''
    const responseType = url.searchParams.get('response_type') ?? ''
    console.log('oauth-authorize GET: client_id=%s redirect_uri=%s scope=%s response_type=%s state=%s', clientId, redirectUri, scope, responseType, state)
    return new Response(renderForm({ clientId, redirectUri, state }), {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  if (req.method === 'POST') {
    const text = await req.text()
    const body = Object.fromEntries(new URLSearchParams(text))
    const { password, client_id: clientId, redirect_uri: redirectUri, state } = body

    const expected = process.env.AP_MASTODON_PASSWORD
    if (!expected || password !== expected) {
      console.log('oauth-authorize POST: bad password for client_id=%s', clientId)
      return new Response(
        renderForm({ clientId: clientId ?? '', redirectUri: redirectUri ?? '', state: state ?? '', error: 'Invalid password' }),
        { status: 401, headers: { 'Content-Type': 'text/html' } },
      )
    }

    const app = await getMastodonApp(clientId)
    if (!app) {
      console.log('oauth-authorize POST: unknown client_id=%s', clientId)
      return new Response('Unknown client_id', { status: 400 })
    }

    const code = randomUUID()
    await setMastodonCode({
      code,
      clientId,
      redirectUri: redirectUri ?? '',
      createdAt: new Date().toISOString(),
    })

    const redirect = new URL(redirectUri)
    redirect.searchParams.set('code', code)
    if (state) redirect.searchParams.set('state', state)

    console.log('oauth-authorize POST: issuing code for client_id=%s redirect=%s', clientId, redirect.toString())
    return new Response(null, {
      status: 302,
      headers: { Location: redirect.toString() },
    })
  }

  return new Response('Method Not Allowed', { status: 405 })
}

export const config: Config = {
  path: '/oauth/authorize',
}
