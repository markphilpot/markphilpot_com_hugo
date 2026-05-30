import type { Config } from '@netlify/functions'

export default async (req: Request): Promise<Response> => {
  console.log('oauth-meta: method=%s', req.method)
  const domain = (process.env.AP_MASTODON_DOMAIN ?? 'markphilpot.com').replace(/^https?:\/\//, '')
  const base = `https://${domain}`

  return new Response(
    JSON.stringify({
      issuer: base,
      authorization_endpoint: `${base}/oauth/authorize`,
      token_endpoint: `${base}/oauth/token`,
      app_registration_endpoint: `${base}/api/v1/apps`,
      scopes_supported: ['read', 'write', 'follow', 'push'],
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'client_credentials'],
      token_endpoint_auth_methods_supported: ['client_secret_post'],
    }),
    { headers: { 'Content-Type': 'application/json' } },
  )
}

export const config: Config = {
  path: '/.well-known/oauth-authorization-server',
}
