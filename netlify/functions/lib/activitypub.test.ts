import { describe, it, expect } from 'vitest'
import { formatNote } from './activitypub.js'
import type { FeedPost } from './types.js'

const microPost: FeedPost = {
  url: 'https://markphilpot.com/micro/202601021234/',
  date: '2026-01-02T12:34:00Z',
  title: '',
  summary: '',
  content: '<p>Hello world</p>',
  section: 'micro',
}

const blogPost: FeedPost = {
  url: 'https://markphilpot.com/posts/2026/01/03/my-post/',
  date: '2026-01-03T10:00:00Z',
  title: 'My Blog Post',
  summary: 'A short summary of the post.',
  content: '<p>Long article content goes here.</p>',
  section: 'blog',
}

describe('formatNote — micro post', () => {
  it('uses the full content HTML unchanged', () => {
    const note = formatNote(microPost)
    expect(note.object.content).toBe('<p>Hello world</p>')
  })

  it('sets required ActivityPub fields', () => {
    const note = formatNote(microPost)
    expect(note.type).toBe('Create')
    expect(note.object.type).toBe('Note')
    expect(note.object.url).toBe(microPost.url)
    expect(note.object.published).toBe(microPost.date)
    expect(note.actor).toBe('https://markphilpot.com/ap/actor')
    expect(note.to).toContain('https://www.w3.org/ns/activitystreams#Public')
    expect(note.cc).toContain('https://markphilpot.com/ap/followers')
  })

  it('has a unique id for each call', () => {
    const a = formatNote(microPost)
    const b = formatNote(microPost)
    expect(a.id).not.toBe(b.id)
  })
})

describe('formatNote — blog post', () => {
  it('uses summary and appends title + URL as backlink', () => {
    const note = formatNote(blogPost)
    expect(note.object.content).toContain('A short summary of the post.')
    expect(note.object.content).toContain('My Blog Post')
    expect(note.object.content).toContain('https://markphilpot.com/posts/2026/01/03/my-post/')
  })

  it('does not include the full article content', () => {
    const note = formatNote(blogPost)
    expect(note.object.content).not.toContain('Long article content goes here.')
  })
})
