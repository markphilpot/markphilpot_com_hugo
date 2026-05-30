import type { Config } from '@netlify/functions'

export default async (req: Request): Promise<Response> => {
  // console.log('mastodon-instance: method=%s path=%s', req.method, new URL(req.url).pathname)
  const domain = process.env.AP_MASTODON_DOMAIN ?? 'markphilpot.com'

  const account = {
    id: '1',
    username: 'self',
    acct: 'self',
    display_name: 'Mark Philpot',
    url: `https://${domain}`,
    avatar: `https://${domain}/apple-touch-icon.png`,
    avatar_static: `https://${domain}/apple-touch-icon.png`,
    header: '',
    header_static: '',
    followers_count: 0,
    following_count: 0,
    statuses_count: 0,
    created_at: '2020-01-01T00:00:00.000Z',
    bot: false,
    group: false,
    discoverable: true,
    locked: false,
    note: '',
    emojis: [],
    fields: [],
  }

  const instance = {
    uri: domain,
    domain,
    title: 'Mark Philpot',
    description: 'Personal blog',
    short_description: 'Personal blog',
    email: '',
    version: '4.0.0',
    urls: {},
    stats: { user_count: 1, status_count: 0, domain_count: 1 },
    languages: ['en'],
    contact_account: account,
    rules: [],
    thumbnail: { url: '' },
    usage: { users: { active_month: 1 } },
    configuration: {
      statuses: { max_characters: 500, max_media_attachments: 0, characters_reserved_per_url: 23 },
      media_attachments: {
        supported_mime_types: [],
        image_size_limit: 0,
        image_matrix_limit: 0,
        video_size_limit: 0,
        video_frame_rate_limit: 0,
        video_matrix_limit: 0,
      },
      polls: { max_options: 0, max_characters_per_option: 0, min_expiration: 300, max_expiration: 2629746 },
    },
  }

  return new Response(JSON.stringify(instance), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config: Config = {
  path: ['/api/v1/instance', '/api/v2/instance'],
}
