import { describe, it, expect } from 'vitest'
import { parseFeedEntries } from './feed.js'

describe('parseFeedEntries', () => {
  it('keeps blog and micro entries', () => {
    const raw = [
      { url: 'https://markphilpot.com/posts/2026/a/', date: '2026-01-01T00:00:00Z', title: 'A', summary: '', content: '', section: 'blog' },
      { url: 'https://markphilpot.com/micro/202601/', date: '2026-01-02T00:00:00Z', title: '', summary: '', content: '', section: 'micro' },
      { url: 'https://markphilpot.com/pages/about/', date: '2020-01-01T00:00:00Z', title: 'About', summary: '', content: '', section: 'pages' },
    ]
    const result = parseFeedEntries(raw)
    expect(result).toHaveLength(2)
    expect(result.map((p) => p.section)).toEqual(['blog', 'micro'])
  })

  it('skips entries with empty url', () => {
    const raw = [
      { url: '', date: '2026-01-01T00:00:00Z', title: 'A', summary: '', content: '', section: 'blog' },
      { url: 'https://markphilpot.com/micro/202601/', date: '2026-01-02T00:00:00Z', title: '', summary: '', content: '', section: 'micro' },
    ]
    expect(parseFeedEntries(raw)).toHaveLength(1)
  })

  it('skips entries with empty date', () => {
    const raw = [
      { url: 'https://markphilpot.com/posts/2026/a/', date: '', title: 'A', summary: '', content: '', section: 'blog' },
    ]
    expect(parseFeedEntries(raw)).toHaveLength(0)
  })

  it('returns an empty array for empty input', () => {
    expect(parseFeedEntries([])).toEqual([])
  })
})
