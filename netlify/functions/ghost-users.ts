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
      users: [
        {
          id: '1',
          name: 'Mark Philpot',
          slug: 'mark-philpot',
          email: 'mark.philpot@gmail.com',
          profile_image: null,
          cover_image: null,
          bio: null,
          website: `https://${domain}`,
          location: null,
          status: 'active',
          created_at: '2020-01-01T00:00:00.000Z',
          updated_at: new Date().toISOString(),
          roles: [{ id: '1', name: 'Administrator', description: 'Administrators' }],
          url: `https://${domain}/author/mark-philpot/`,
        },
      ],
    }),
    { headers: { 'Content-Type': 'application/json' } },
  )
}

export const config: Config = {
  path: ['/ghost/api/v4/admin/users/me/', '/ghost/api/admin/users/me/'],
}
