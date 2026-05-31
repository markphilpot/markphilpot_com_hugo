import { describe, it, expect } from 'vitest'
import { htmlToMarkdown } from './html-to-markdown.js'

describe('htmlToMarkdown', () => {
  it('converts paragraphs to plain text', () => {
    expect(htmlToMarkdown('<p>Hello world</p>')).toBe('Hello world')
  })

  it('converts h1 and h2 to ATX style', () => {
    expect(htmlToMarkdown('<h1>Title</h1>')).toBe('# Title')
    expect(htmlToMarkdown('<h2>Subtitle</h2>')).toBe('## Subtitle')
  })

  it('converts strong to **bold**', () => {
    expect(htmlToMarkdown('<strong>bold</strong>')).toBe('**bold**')
  })

  it('converts em to _italic_', () => {
    expect(htmlToMarkdown('<em>italic</em>')).toBe('_italic_')
  })

  it('converts anchor tags to markdown links', () => {
    expect(htmlToMarkdown('<a href="https://example.com">Example</a>')).toBe('[Example](https://example.com)')
  })

  it('converts img tags to markdown images', () => {
    expect(htmlToMarkdown('<img src="photo.jpg" alt="a photo">')).toBe('![a photo](photo.jpg)')
  })

  it('converts pre/code to fenced code blocks', () => {
    const result = htmlToMarkdown('<pre><code>const x = 1</code></pre>')
    expect(result).toBe('```\nconst x = 1\n```')
  })

  it('converts ul with - bullet markers', () => {
    const result = htmlToMarkdown('<ul><li>item 1</li><li>item 2</li></ul>')
    expect(result).toContain('-   item 1')
    expect(result).toContain('-   item 2')
  })

  it('converts blockquote', () => {
    expect(htmlToMarkdown('<blockquote><p>a quote</p></blockquote>')).toBe('> a quote')
  })

  it('handles multiple paragraphs separated by blank lines', () => {
    const result = htmlToMarkdown('<p>First</p><p>Second</p>')
    expect(result).toContain('First')
    expect(result).toContain('Second')
    expect(result).toMatch(/First\n\n+Second/)
  })
})
