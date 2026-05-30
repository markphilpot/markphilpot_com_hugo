import type { Config } from '@netlify/functions'

export default async (req: Request): Promise<Response> => {
  const path = new URL(req.url).pathname
  console.log('nodeinfo: method=%s path=%s', req.method, path)

  const domain = (process.env.AP_MASTODON_DOMAIN ?? 'markphilpot.com').replace(/^https?:\/\//, '')
  const base = `https://${domain}`

  if (path === '/.well-known/nodeinfo') {
    return new Response(
      JSON.stringify({
        links: [
          { rel: 'http://nodeinfo.schemaversion.org/schema/2.0', href: `${base}/nodeinfo/2.0` },
          { rel: 'http://nodeinfo.schemaversion.org/schema/2.1', href: `${base}/nodeinfo/2.1` },
        ],
      }),
      { headers: { 'Content-Type': 'application/json' } },
    )
  }

  // /nodeinfo/2.0 and /nodeinfo/2.1
  return new Response(
    JSON.stringify({
      version: '2.1',
      software: { name: 'mastodon', version: '4.0.0', homepage: base, repository: base },
      protocols: ['activitypub'],
      usage: { users: { total: 1, activeMonth: 1, activeHalfyear: 1 }, localPosts: 0 },
      openRegistrations: false,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  )
}

export const config: Config = {
  path: ['/.well-known/nodeinfo', '/nodeinfo/2.0', '/nodeinfo/2.1'],
}
