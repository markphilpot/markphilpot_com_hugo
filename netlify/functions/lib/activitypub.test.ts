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

describe('formatNote — with images', () => {
  it('strips img tags from content and adds AP attachment for micro-client posts', () => {
    const post: FeedPost = {
      url: 'https://markphilpot.com/micro-client/2026/slug/',
      date: '2026-05-30T10:00:00Z',
      title: '',
      summary: '',
      content: '<p>Look at this</p><img src="https://markphilpot.com/micro-client/2026/slug/photo.jpg">',
      section: 'micro-client',
    }
    const note = formatNote(post)
    expect(note.object.content).not.toContain('<img')
    expect(note.object.content).toContain('<p>Look at this</p>')
    expect(note.object.attachment).toHaveLength(1)
    expect(note.object.attachment![0].url).toBe('https://markphilpot.com/micro-client/2026/slug/photo.jpg')
    expect(note.object.attachment![0].type).toBe('Document')
    expect(note.object.attachment![0].mediaType).toBe('image/jpeg')
    expect(note.object.attachment![0].name).toBeNull()
  })

  it('does not include attachment field when no images in micro post', () => {
    const post: FeedPost = {
      url: 'https://markphilpot.com/micro/202601021234/',
      date: '2026-01-02T12:34:00Z',
      title: '',
      summary: '',
      content: '<p>Hello world</p>',
      section: 'micro',
    }
    const note = formatNote(post)
    expect(note.object.attachment).toBeUndefined()
  })

  it('does not add attachments for blog posts even if content has images', () => {
    const post: FeedPost = {
      url: 'https://markphilpot.com/posts/2026/01/03/my-post/',
      date: '2026-01-03T10:00:00Z',
      title: 'My Blog Post',
      summary: 'A short summary.',
      content: '<p>Full content.</p><img src="https://markphilpot.com/photo.jpg">',
      section: 'blog',
    }
    const note = formatNote(post)
    expect(note.object.attachment).toBeUndefined()
  })

  it('resolves relative image src against post url', () => {
    const post: FeedPost = {
      url: 'https://markphilpot.com/micro-client/2026/slug/',
      date: '2026-05-30T10:00:00Z',
      title: '',
      summary: '',
      content: '<p>text</p><img src="photo.png">',
      section: 'micro-client',
    }
    const note = formatNote(post)
    expect(note.object.attachment![0].url).toBe('https://markphilpot.com/micro-client/2026/slug/photo.png')
  })

  it('detects mediaType from file extension', () => {
    const mkPost = (filename: string): FeedPost => ({
      url: 'https://markphilpot.com/micro-client/2026/slug/',
      date: '2026-05-30T10:00:00Z',
      title: '',
      summary: '',
      content: `<img src="${filename}">`,
      section: 'micro-client',
    })
    expect(formatNote(mkPost('a.png')).object.attachment![0].mediaType).toBe('image/png')
    expect(formatNote(mkPost('b.gif')).object.attachment![0].mediaType).toBe('image/gif')
    expect(formatNote(mkPost('c.webp')).object.attachment![0].mediaType).toBe('image/webp')
    expect(formatNote(mkPost('d.jpg')).object.attachment![0].mediaType).toBe('image/jpeg')
    expect(formatNote(mkPost('e.jpeg')).object.attachment![0].mediaType).toBe('image/jpeg')
  })
})
