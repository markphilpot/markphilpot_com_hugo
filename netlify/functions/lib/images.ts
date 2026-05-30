export type ParsedImage = { src: string; zoomSrc?: string }

export function parseImgSrcs(html: string): { content: string; images: ParsedImage[] } {
  const images: ParsedImage[] = []
  const imgRegex = /<img\b([^>]*)>/gi
  let match
  while ((match = imgRegex.exec(html)) !== null) {
    const attrs = match[1]
    const srcMatch = attrs.match(/\bsrc="([^"]+)"/)
    const zoomMatch = attrs.match(/\bdata-zoom-src="([^"]+)"/)
    if (srcMatch) {
      images.push({ src: srcMatch[1], ...(zoomMatch ? { zoomSrc: zoomMatch[1] } : {}) })
    }
  }
  const content = html
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<div[^>]*>\s*<\/div>/gi, '')
    .trim()
  return { content, images }
}
