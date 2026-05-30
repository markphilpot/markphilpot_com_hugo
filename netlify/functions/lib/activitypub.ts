import { randomUUID } from 'node:crypto'
import type { FeedPost } from './types.js'
import { parseImgSrcs } from './images.js'

const ACTOR_URL = 'https://markphilpot.com/ap/actor'
const FOLLOWERS_URL = 'https://markphilpot.com/ap/followers'
const PUBLIC = 'https://www.w3.org/ns/activitystreams#Public'

type ApAttachment = {
  type: 'Document'
  mediaType: string
  url: string
  name: null
}

export type CreateNote = {
  '@context': string[]
  type: 'Create'
  id: string
  actor: string
  published: string
  to: string[]
  cc: string[]
  object: {
    type: 'Note'
    id: string
    attributedTo: string
    content: string
    url: string
    published: string
    to: string[]
    cc: string[]
    attachment?: ApAttachment[]
  }
}

export function formatNote(post: FeedPost): CreateNote {
  let content: string
  let attachment: ApAttachment[] | undefined

  if (post.section === 'blog') {
    content = blogContent(post)
  } else {
    const { content: stripped, images } = parseImgSrcs(post.content)
    content = stripped
    if (images.length > 0) {
      attachment = images.map((img) => ({
        type: 'Document' as const,
        mediaType: guessMimeType(img.src),
        url: resolveUrl(img.src, post.url),
        name: null,
      }))
    }
  }

  return {
    '@context': [
      'https://www.w3.org/ns/activitystreams',
      'https://w3id.org/security/v1',
    ],
    type: 'Create',
    id: `https://markphilpot.com/ap/activities/${randomUUID()}`,
    actor: ACTOR_URL,
    published: post.date,
    to: [PUBLIC],
    cc: [FOLLOWERS_URL],
    object: {
      type: 'Note',
      id: post.url,
      attributedTo: ACTOR_URL,
      content,
      url: post.url,
      published: post.date,
      to: [PUBLIC],
      cc: [FOLLOWERS_URL],
      ...(attachment ? { attachment } : {}),
    },
  }
}

function resolveUrl(src: string, base: string): string {
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  return base.endsWith('/') ? `${base}${src}` : `${base}/${src}`
}

function guessMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  }
  return map[ext] ?? 'image/jpeg'
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
