import { describe, it, expect } from 'vitest'
import { computePixelValues, buildMagickArgs, type Config } from './gen-favicon.js'

const testConfig: Config = {
  codePoint:    0x1D13D,
  fontPath:     '/test/fonts/Bravura.otf',
  fgColor:      '#ffffff',
  bgColor:      '#1a1a1a',
  borderColor:  '#ffffff',
  borderWidth:  3,
  cornerRadius: 15,
  glyphScale:   0.72,
}

describe('computePixelValues', () => {
  it('computes pointsize as size * glyphScale rounded', () => {
    const { pointsize } = computePixelValues(testConfig, 512)
    expect(pointsize).toBe(369)   // round(512 * 0.72) = round(368.64)
  })

  it('computes cornerRadius as size * cornerRadius% rounded', () => {
    const { cornerRadius } = computePixelValues(testConfig, 512)
    expect(cornerRadius).toBe(77)  // round(512 * 15/100) = round(76.8)
  })

  it('computes borderWidth as size * borderWidth% rounded', () => {
    const { borderWidth } = computePixelValues(testConfig, 512)
    expect(borderWidth).toBe(15)   // round(512 * 3/100) = round(15.36)
  })

  it('scales correctly for small sizes', () => {
    const { pointsize, cornerRadius } = computePixelValues(testConfig, 16)
    expect(pointsize).toBe(12)    // round(16 * 0.72) = round(11.52)
    expect(cornerRadius).toBe(2)  // round(16 * 15/100) = round(2.4)
  })
})

describe('buildMagickArgs', () => {
  it('starts with the target size canvas', () => {
    const args = buildMagickArgs(testConfig, 512, 'out.png')
    expect(args[0]).toBe('-colorspace')
    expect(args[1]).toBe('sRGB')
    expect(args[2]).toBe('-size')
    expect(args[3]).toBe('512x512')
  })

  it('sets colorspace to sRGB', () => {
    const args = buildMagickArgs(testConfig, 512, 'out.png')
    const idx = args.indexOf('-colorspace')
    expect(idx).toBeGreaterThan(-1)
    expect(args[idx + 1]).toBe('sRGB')
  })

  it('uses transparent canvas with background color drawn via fill', () => {
    const args = buildMagickArgs(testConfig, 512, 'out.png')
    expect(args).toContain('xc:none')
    // background color set via -fill before the roundrectangle draw
    const fillIdx = args.indexOf('-fill')
    expect(fillIdx).toBeGreaterThan(-1)
    expect(args[fillIdx + 1]).toBe('#1a1a1a')
  })

  it('includes the font path', () => {
    const args = buildMagickArgs(testConfig, 512, 'out.png')
    const idx = args.indexOf('-font')
    expect(idx).toBeGreaterThan(-1)
    expect(args[idx + 1]).toBe('/test/fonts/Bravura.otf')
  })

  it('includes the Unicode character via -annotate', () => {
    const args = buildMagickArgs(testConfig, 512, 'out.png')
    const idx = args.indexOf('-annotate')
    expect(idx).toBeGreaterThan(-1)
    expect(args[idx + 1]).toBe('0')
    expect(args[idx + 2]).toBe('𝄽')
  })

  it('includes a roundrectangle draw command for the background', () => {
    const args = buildMagickArgs(testConfig, 512, 'out.png')
    const drawCmds = args.filter((_, i) => args[i - 1] === '-draw')
    const bgDraw = drawCmds.find(d => d.includes('roundrectangle 0,0'))
    expect(bgDraw).toBeDefined()
    expect(bgDraw).toBe('roundrectangle 0,0 511,511 77,77')
  })

  it('includes border stroke args when borderColor is set', () => {
    const args = buildMagickArgs(testConfig, 512, 'out.png')
    const si = args.indexOf('-stroke')
    expect(si).toBeGreaterThan(-1)
    expect(args[si + 1]).toBe('#ffffff')
  })

  it('omits border args when borderColor is null', () => {
    const cfg: Config = { ...testConfig, borderColor: null }
    const args = buildMagickArgs(cfg, 512, 'out.png')
    expect(args).not.toContain('-stroke')
  })

  it('floors borderWidth to 1px at small sizes rather than dropping the border', () => {
    const cfg: Config = { ...testConfig, borderWidth: 1, borderColor: '#ffffff' }
    // size=16, borderWidth=1% → round(16 * 0.01) = 0 → floors to 1 so border is still drawn
    const args = buildMagickArgs(cfg, 16, 'out.png')
    expect(args).toContain('-stroke')
  })

  it('omits border args when borderWidth config is 0', () => {
    const cfg: Config = { ...testConfig, borderWidth: 0, borderColor: '#ffffff' }
    const args = buildMagickArgs(cfg, 512, 'out.png')
    expect(args).not.toContain('-stroke')
  })

  it('ends with the output path', () => {
    const args = buildMagickArgs(testConfig, 512, '/tmp/test.png')
    expect(args[args.length - 1]).toBe('/tmp/test.png')
  })
})
