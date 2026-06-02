import { spawnSync } from 'child_process'
import { existsSync, copyFileSync, mkdirSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

// --- Path constants (derived from script location, not cwd) ---

const __filename = fileURLToPath(import.meta.url)
const SCRIPTS_DIR    = dirname(__filename)
const ROOT           = join(SCRIPTS_DIR, '..')
const STATIC         = join(ROOT, 'static')
const FAVICON_SUBDIR = join(STATIC, 'assets', 'favicon')

// --- Config (edit this block to change the favicon appearance) ---

export const config = {
  codePoint:    0x1D10F,
  fontPath:     join(SCRIPTS_DIR, 'fonts', 'Bravura.otf'),
  fgColor:      '#ffffff',
  bgColor:      '#1a1a1a',
  borderColor:  '#ffffff' as string | null,
  borderWidth:  1,           // % of canvas width
  cornerRadius: 15,          // % of canvas width (0 = square, 50 = pill)
  glyphScale:   0.72,        // fraction of canvas width the glyph occupies
}

export type Config = typeof config

// --- Pure utilities (exported for testing) ---

export interface PixelValues {
  pointsize: number
  cornerRadius: number
  borderWidth: number
}

export function computePixelValues(cfg: Config, size: number): PixelValues {
  const rawBorder = Math.round(size * cfg.borderWidth / 100)
  return {
    pointsize:    Math.round(size * cfg.glyphScale),
    cornerRadius: Math.round(size * cfg.cornerRadius / 100),
    borderWidth:  cfg.borderWidth > 0 ? Math.max(1, rawBorder) : 0,
  }
}

export function buildMagickArgs(cfg: Config, size: number, outputPath: string): string[] {
  const char = String.fromCodePoint(cfg.codePoint)
  const { pointsize, cornerRadius: r, borderWidth: bw } = computePixelValues(cfg, size)
  const N = size

  const args: string[] = [
    '-colorspace', 'sRGB',
    '-size', `${N}x${N}`,
    'xc:none',                           // transparent canvas — corners stay transparent
    '-fill', cfg.bgColor,
    '-draw', `roundrectangle 0,0 ${N - 1},${N - 1} ${r},${r}`,  // sets color AND alpha
    '-font', cfg.fontPath,
    '-pointsize', String(pointsize),
    '-fill', cfg.fgColor,
    '-gravity', 'Center',
    '-annotate', '0', char,
  ]

  if (cfg.borderColor !== null && bw > 0) {
    const inset = bw
    args.push(
      '-fill', 'none',
      '-stroke', cfg.borderColor,
      '-strokewidth', String(bw * 2),
      '-draw', `roundrectangle ${inset},${inset} ${N - 1 - inset},${N - 1 - inset} ${r},${r}`,
    )
  }

  args.push(outputPath)
  return args
}

// --- Side-effecting functions ---

export function checkDependencies(cfg: Config): void {
  const magickCheck = spawnSync('magick', ['--version'], { encoding: 'utf8' })
  if (magickCheck.error || magickCheck.status !== 0) {
    console.error('Error: ImageMagick not found on PATH.')
    console.error('Install via: brew install imagemagick')
    process.exit(1)
  }

  if (!existsSync(cfg.fontPath)) {
    console.error(`Font not found: ${cfg.fontPath}`)
    console.error('')
    console.error('To render musical notation glyphs, install the Bravura font:')
    console.error('  1. Download from: https://github.com/steinbergmedia/bravura/releases')
    console.error('     (Download the zip, extract Bravura.otf)')
    console.error(`  2. Copy Bravura.otf to ${cfg.fontPath}`)
    console.error('  3. Re-run: pnpm favicon')
    process.exit(1)
  }
}

export function generatePng(cfg: Config, size: number, outputPath: string): void {
  const args = buildMagickArgs(cfg, size, outputPath)
  const result = spawnSync('magick', args, { encoding: 'utf8' })
  if (result.error || result.status !== 0) {
    const detail = result.error?.message ?? result.stderr ?? '(no output)'
    console.error(`magick failed for size ${size}:\n${detail}`)
    process.exit(1)
  }
}

export function generateIco(png16: string, png32: string, outputPath: string): void {
  for (const p of [png16, png32]) {
    if (!existsSync(p)) {
      console.error(`ICO input not found: ${p}`)
      process.exit(1)
    }
  }
  const result = spawnSync('magick', [png16, png32, outputPath], { encoding: 'utf8' })
  if (result.error || result.status !== 0) {
    const detail = result.error?.message ?? result.stderr ?? '(no output)'
    console.error(`magick ICO generation failed:\n${detail}`)
    process.exit(1)
  }
}

// --- Entry point ---

const SIZES: Array<{ size: number; name: string }> = [
  { size: 16,  name: 'favicon-16x16.png' },
  { size: 32,  name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
]

async function main(): Promise<void> {
  checkDependencies(config)

  for (const { size, name } of SIZES) {
    const outputPath = join(STATIC, name)
    console.log(`Generating ${name} (${size}×${size})...`)
    generatePng(config, size, outputPath)
  }

  console.log('Generating favicon.ico...')
  generateIco(
    join(STATIC, 'favicon-16x16.png'),
    join(STATIC, 'favicon-32x32.png'),
    join(STATIC, 'favicon.ico'),
  )

  // Mirror browser-hint assets into static/assets/favicon/
  // Android Chrome assets are referenced from site.webmanifest at the root — no copy needed.
  mkdirSync(FAVICON_SUBDIR, { recursive: true })
  for (const name of ['favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png']) {
    copyFileSync(join(STATIC, name), join(FAVICON_SUBDIR, name))
  }
  copyFileSync(join(STATIC, 'favicon.ico'), join(FAVICON_SUBDIR, 'favicon.ico'))

  console.log('\nAll favicon assets generated successfully.')
  console.log('Note: static/assets/favicon/safari-pinned-tab.svg was not modified.')
  console.log('      It requires a hand-crafted monochrome SVG path — replace it manually.')
}

const isMain = resolve(process.argv[1]) === __filename
if (isMain) {
  main().catch(e => { console.error(e); process.exit(1) })
}
