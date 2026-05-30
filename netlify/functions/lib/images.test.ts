import { describe, it, expect } from 'vitest'
import { parseImgSrcs } from './images.js'

describe('parseImgSrcs', () => {
  it('extracts src from a single img tag', () => {
    const { images, content } = parseImgSrcs('<p>text</p><img src="photo.jpg">')
    expect(images).toEqual([{ src: 'photo.jpg' }])
    expect(content).toBe('<p>text</p>')
  })

  it('extracts both src and zoomSrc when data-zoom-src is present', () => {
    const { images } = parseImgSrcs('<img src="/img/thumb.jpg" data-zoom-src="/img/full.jpg">')
    expect(images).toHaveLength(1)
    expect(images[0].src).toBe('/img/thumb.jpg')
    expect(images[0].zoomSrc).toBe('/img/full.jpg')
  })

  it('returns empty images and unchanged content when no img tags', () => {
    const { images, content } = parseImgSrcs('<p>hello world</p>')
    expect(images).toEqual([])
    expect(content).toBe('<p>hello world</p>')
  })

  it('strips empty div wrappers left after img removal', () => {
    const { content } = parseImgSrcs('<div class="mt-5"><img src="x.jpg"></div><p>text</p>')
    expect(content).not.toContain('<div')
    expect(content).toContain('<p>text</p>')
  })

  it('extracts multiple images in order', () => {
    const { images } = parseImgSrcs('<img src="a.jpg"><img src="b.png">')
    expect(images).toHaveLength(2)
    expect(images[0].src).toBe('a.jpg')
    expect(images[1].src).toBe('b.png')
  })
})
