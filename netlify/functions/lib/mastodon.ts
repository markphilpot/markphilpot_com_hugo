import type { FeedPost } from './types.js'

export type MastodonAccount = {
  id: string
  username: string
  acct: string
  display_name: string
  url: string
  avatar: string
  avatar_static: string
  header: string
  header_static: string
  followers_count: number
  following_count: number
  statuses_count: number
  created_at: string
  bot: boolean
  group: boolean
  discoverable: boolean
  locked: boolean
  note: string
  emojis: unknown[]
  fields: unknown[]
}

export type MastodonMediaAttachment = {
  id: string
  type: 'image'
  url: string
  preview_url: string
  description: string | null
  meta: Record<string, unknown>
}

export type MastodonStatus = {
  id: string
  uri: string
  created_at: string
  content: string
  url: string
  account: MastodonAccount
  visibility: 'public'
  media_attachments: MastodonMediaAttachment[]
  mentions: unknown[]
  tags: unknown[]
  emojis: unknown[]
  replies_count: number
  reblogs_count: number
  favourites_count: number
  reblog: null
  in_reply_to_id: null
  sensitive: boolean
  spoiler_text: string
  language: null
  text: null
}

function staticAccount(domain: string): MastodonAccount {
  return {
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
}

function makeAbsolute(url: string, domain: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${domain}${url.startsWith('/') ? '' : '/'}${url}`
}

function extractImages(
  html: string,
  domain: string,
): { content: string; attachments: MastodonMediaAttachment[] } {
  const attachments: MastodonMediaAttachment[] = []
  const imgRegex = /<img\b([^>]*)>/gi
  let match
  let idx = 0
  while ((match = imgRegex.exec(html)) !== null) {
    const attrs = match[1]
    const srcMatch = attrs.match(/\bsrc="([^"]+)"/)
    const zoomMatch = attrs.match(/\bdata-zoom-src="([^"]+)"/)
    if (srcMatch) {
      const previewUrl = makeAbsolute(srcMatch[1], domain)
      const url = zoomMatch ? makeAbsolute(zoomMatch[1], domain) : previewUrl
      attachments.push({ id: String(idx++), type: 'image', url, preview_url: previewUrl, description: null, meta: {} })
    }
  }
  const content = html
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<div[^>]*>\s*<\/div>/gi, '')
    .trim()
  return { content, attachments }
}

function blogContent(post: FeedPost): string {
  const parts: string[] = []
  if (post.summary) parts.push(`<p>${escapeHtml(post.summary)}</p>`)
  parts.push(`<p><a href="${escapeHtml(post.url)}">${escapeHtml(post.title)}</a></p>`)
  return parts.join('\n')
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function feedPostToStatus(
  post: FeedPost,
  domain = process.env.AP_MASTODON_DOMAIN ?? 'markphilpot.com',
): MastodonStatus {
  let content: string
  let media_attachments: MastodonMediaAttachment[]
  if (post.section === 'blog') {
    content = blogContent(post)
    media_attachments = []
  } else {
    const extracted = extractImages(post.content, domain)
    content = extracted.content
    media_attachments = extracted.attachments
  }
  return {
    id: String(new Date(post.date).getTime()),
    uri: post.url,
    created_at: post.date,
    content,
    url: post.url,
    account: staticAccount(domain),
    visibility: 'public',
    media_attachments,
    mentions: [],
    tags: [],
    emojis: [],
    replies_count: 0,
    reblogs_count: 0,
    favourites_count: 0,
    reblog: null,
    in_reply_to_id: null,
    sensitive: false,
    spoiler_text: '',
    language: null,
    text: null,
  }
}
