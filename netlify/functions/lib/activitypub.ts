import { randomUUID } from 'node:crypto'
import type { FeedPost } from './types.js'

const ACTOR_URL = 'https://markphilpot.com/ap/actor'
const FOLLOWERS_URL = 'https://markphilpot.com/ap/followers'
const PUBLIC = 'https://www.w3.org/ns/activitystreams#Public'

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
  }
}

export function formatNote(post: FeedPost): CreateNote {
  const content = post.section === 'blog' ? blogContent(post) : post.content

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
    },
  }
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
