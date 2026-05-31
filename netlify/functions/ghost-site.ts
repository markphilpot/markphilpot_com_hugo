import type { Config } from '@netlify/functions'
import { validateGhostJWT } from './lib/ghost-auth.js'

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  if (!validateGhostJWT(req.headers.get('authorization') ?? '')) {
    return new Response('Unauthorized', { status: 401 })
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
