import { describe, it, expect } from 'vitest'
import { feedPostToStatus } from './mastodon.js'
import type { FeedPost } from './types.js'

const microPost: FeedPost = {
  url: 'https://markphilpot.com/micro-client/2026/2026-05-29t10-00-00/',
  date: '2026-05-29T10:00:00.000Z',
  title: '',
  summary: '',
  content: '<p>Hello world</p>',
  section: 'micro-client',
}

const blogPost: FeedPost = {
  url: 'https://markphilpot.com/blog/2026/my-post/',
  date: '2026-05-29T09:00:00.000Z',
  title: 'My Blog Post',
  summary: 'A short summary.',
  content: '<p>Full article content.</p>',
  section: 'blog',
}

describe('feedPostToStatus', () => {
  it('derives id from epoch milliseconds of the date', () => {
    const status = feedPostToStatus(microPost, 'example.com')
    expect(status.id).toBe(String(new Date('2026-05-29T10:00:00.000Z').getTime()))
  })

  it('passes micro-client content through unchanged', () => {
    const status = feedPostToStatus(microPost, 'example.com')
    expect(status.content).toBe('<p>Hello world</p>')
  })

  it('renders blog post as summary + link, not full content', () => {
    const status = feedPostToStatus(blogPost, 'example.com')
    expect(status.content).toContain('A short summary.')
    expect(status.content).toContain('My Blog Post')
    expect(status.content).toContain('https://markphilpot.com/blog/2026/my-post/')
    expect(status.content).not.toContain('Full article content.')
  })

  it('sets static fields correctly', () => {
    const status = feedPostToStatus(microPost, 'example.com')
    expect(status.visibility).toBe('public')
    expect(status.media_attachments).toEqual([])
    expect(status.reblog).toBeNull()
    expect(status.in_reply_to_id).toBeNull()
    expect(status.sensitive).toBe(false)
    expect(status.account.username).toBe('self')
    expect(status.account.url).toBe('https://example.com')
    expect(status.account.avatar).toBe('https://example.com/apple-touch-icon.png')
  })

  it('ids from two different dates are different', () => {
    const a = feedPostToStatus(microPost, 'example.com')
    const b = feedPostToStatus(blogPost, 'example.com')
    expect(a.id).not.toBe(b.id)
  })
})
