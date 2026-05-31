import type { Config } from '@netlify/functions'
import { randomUUID } from 'node:crypto'
import { validateGhostJWT } from './lib/ghost-auth.js'
import { getMediaUpload, getMediaBytes } from './lib/blobs.js'
import { setGhostPost, getGhostPost } from './lib/ghost-blobs.js'
import { createCommit } from './lib/github.js'
import { htmlToMarkdown } from './lib/html-to-markdown.js'
import type { GhostPostRecord } from './lib/types.js'

// ---- Types ----

type GhostTag = { name: string }

type GhostPostInput = {
  title?: string
  html?: string
  status?: string
  slug?: string
  tags?: GhostTag[]
  feature_image?: string
  updated_at?: string
}

// ---- Helpers ----

const GHOST_IMG_RE = /https?:\/\/[^"'\s<>]+\/\.ghost-img\/([a-f0-9-]+)/g

function extractGhostImgIds(text: string): string[] {
  const ids: string[] = []
  let m: RegExpExecArray | null
  const re = new RegExp(GHOST_IMG_RE.source, 'g')
  while ((m = re.exec(text)) !== null) ids.push(m[1])
  return [...new Set(ids)]
}

function rewriteImgSrcs(html: string, idToFilename: Map<string, string>): string {
  return html.replace(new RegExp(GHOST_IMG_RE.source, 'g'), (match, id) => {
    return idToFilename.get(id) ?? match
  })
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function buildFrontmatter(opts: {
  title: string | undefined
  isoDate: string
  tags: string[]
  slug: string
  draft: boolean
  ghostId: string
  featureFilename?: string
}): string {
  const lines = ['---']
  if (opts.title) lines.push(`title: ${JSON.stringify(opts.title)}`)
  lines.push(
    `date: '${opts.isoDate}'`,
    `tags: [${opts.tags.join(', ')}]`,
    `slug: ${opts.slug}`,
    `draft: ${opts.draft}`,
    `ghostId: ${opts.ghostId}`,
  )
  if (opts.featureFilename) lines.push(`featureimage: ${opts.featureFilename}`)
  lines.push('---')
  return lines.join('\n')
}

type ProcessedPost = {
  mdContent: string
  binaryFiles: { path: string; data: ArrayBuffer }[]
  slug: string
}

async function processPost(opts: {
  post: GhostPostInput
  ghostId: string
  bundlePath: string
  publishDate: Date
  slug: string
}): Promise<ProcessedPost> {
  const html = opts.post.html ?? ''
  const featureImage = opts.post.feature_image ?? ''
  const tags = (opts.post.tags ?? []).map((t) => t.name).filter(Boolean)
  const draft = opts.post.status !== 'published'

  // Collect all ghost-img IDs from HTML content and feature_image
  const htmlIds = extractGhostImgIds(html)
  const featureIds = featureImage ? extractGhostImgIds(featureImage) : []
  const featureId = featureIds[0]
  const allIds = [...new Set([...htmlIds, ...featureIds])]

  // Fetch all blobs
  const binaryFiles: { path: string; data: ArrayBuffer }[] = []
  const idToFilename = new Map<string, string>()
  let featureFilename: string | undefined

  await Promise.all(
    allIds.map(async (id) => {
      const [meta, bytes] = await Promise.all([getMediaUpload(id), getMediaBytes(id)])
      if (!meta || !bytes) return
      const assetPath = `assets/${meta.filename}`
      idToFilename.set(id, assetPath)
      binaryFiles.push({ path: `${opts.bundlePath}/${assetPath}`, data: bytes })
      if (id === featureId) featureFilename = assetPath
    }),
  )

  // Convert HTML → Markdown
  const rewrittenHtml = rewriteImgSrcs(html, idToFilename)
  const markdown = htmlToMarkdown(rewrittenHtml)

  // Build Hugo page bundle content
  const isoDate = opts.publishDate.toISOString().split('.')[0]
  const frontmatter = buildFrontmatter({
    title: opts.post.title?.trim() || undefined,
    isoDate,
    tags,
    slug: opts.slug,
    draft,
    ghostId: opts.ghostId,
    featureFilename,
  })

  const mdContent = `${frontmatter}\n\n${markdown}\n`

  return { mdContent, binaryFiles, slug: opts.slug }
}

function ghostPostResponse(opts: {
  ghostId: string
  title: string | undefined
  slug: string
  status: string
  now: Date
  domain: string
  year: number
}): object {
  const iso = opts.now.toISOString()
  return {
    posts: [
      {
        id: opts.ghostId,
        uuid: opts.ghostId,
        title: opts.title,
        slug: opts.slug,
        status: opts.status,
        created_at: iso,
        updated_at: iso,
        published_at: opts.status === 'published' ? iso : null,
        url: `https://${opts.domain}/direct/${opts.year}/${opts.slug}/`,
      },
    ],
  }
}

// ---- Handlers ----

async function handleCreate(req: Request): Promise<Response> {
  const body = (await req.json()) as { posts?: GhostPostInput[] }
  const post = body.posts?.[0]

  if (!post) {
    return new Response(
      JSON.stringify({ errors: [{ message: 'posts array is required' }] }),
      { status: 422, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const githubToken = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const domain = process.env.AP_MASTODON_DOMAIN ?? 'markphilpot.com'

  if (!githubToken || !owner || !repo) {
    console.error('ghost-posts: missing GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO')
    return new Response('Server configuration error', { status: 500 })
  }

  const now = new Date()
  const year = now.getUTCFullYear()
  const title = post.title?.trim() || undefined
  const dateSlug = now.toISOString().split('.')[0].replace(/:/g, '-')
  const slug = post.slug?.trim() || (title ? slugify(title) : dateSlug)
  const ghostId = randomUUID()
  const bundlePath = `content/direct/${year}/${slug}`
  const indexPath = `${bundlePath}/index.md`

  const { mdContent, binaryFiles } = await processPost({ post: { ...post, title }, ghostId, bundlePath, publishDate: now, slug })

  const commitMessage = title ? `direct: ${title.slice(0, 60)}` : `direct: ${dateSlug}`

  try {
    await createCommit({
      owner,
      repo,
      branch: 'main',
      message: commitMessage,
      token: githubToken,
      textFiles: [{ path: indexPath, content: mdContent }],
      binaryFiles,
    })
  } catch (err) {
    console.error('ghost-posts: GitHub commit failed', err)
    return new Response('Failed to save post', { status: 500 })
  }

  const record: GhostPostRecord = {
    ghostId,
    slug,
    year,
    path: indexPath,
    createdAt: now.toISOString(),
    title: title ?? '',
  }
  await setGhostPost(record)

  return new Response(
    JSON.stringify(ghostPostResponse({ ghostId, title, slug, status: post.status ?? 'published', now, domain, year })),
    { status: 201, headers: { 'Content-Type': 'application/json' } },
  )
}

async function handleUpdate(req: Request, ghostId: string): Promise<Response> {
  const body = (await req.json()) as { posts?: GhostPostInput[] }
  const post = body.posts?.[0]

  if (!post) {
    return new Response(
      JSON.stringify({ errors: [{ message: 'posts array is required' }] }),
      { status: 422, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const record = await getGhostPost(ghostId)
  if (!record) {
    return new Response(JSON.stringify({ errors: [{ message: 'Post not found' }] }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const githubToken = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const domain = process.env.AP_MASTODON_DOMAIN ?? 'markphilpot.com'

  if (!githubToken || !owner || !repo) {
    console.error('ghost-posts: missing GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO')
    return new Response('Server configuration error', { status: 500 })
  }

  const bundlePath = `content/direct/${record.year}/${record.slug}`
  const title = post.title ?? record.slug
  const now = new Date()

  const { mdContent, binaryFiles } = await processPost({
    post: { ...post, title },
    ghostId,
    bundlePath,
    publishDate: new Date(record.createdAt),  // preserve original date
    slug: record.slug,
  })

  const commitMessage = `direct: update ${title.slice(0, 55)}`

  try {
    await createCommit({
      owner,
      repo,
      branch: 'main',
      message: commitMessage,
      token: githubToken,
      textFiles: [{ path: record.path, content: mdContent }],
      binaryFiles,
    })
  } catch (err) {
    console.error('ghost-posts: GitHub update failed', err)
    return new Response('Failed to update post', { status: 500 })
  }

  return new Response(
    JSON.stringify(
      ghostPostResponse({
        ghostId,
        title,
        slug: record.slug,
        status: post.status ?? 'published',
        now,
        domain,
        year: record.year,
      }),
    ),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}

async function handleGet(ghostId: string): Promise<Response> {
  const record = await getGhostPost(ghostId)
  if (!record) {
    return new Response(JSON.stringify({ errors: [{ message: 'Post not found' }] }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const domain = process.env.AP_MASTODON_DOMAIN ?? 'markphilpot.com'
  const iso = record.createdAt
  return new Response(
    JSON.stringify({
      posts: [{
        id: record.ghostId,
        uuid: record.ghostId,
        title: record.title ?? '',
        slug: record.slug,
        status: 'published',
        created_at: iso,
        updated_at: iso,
        published_at: iso,
        url: `https://${domain}/direct/${record.year}/${record.slug}/`,
      }],
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}

// ---- Main handler ----

export default async (req: Request): Promise<Response> => {
  if (!validateGhostJWT(req.headers.get('authorization') ?? '')) {
    return new Response('Unauthorized', { status: 401 })
  }

  const url = new URL(req.url)
  // Normalize consecutive slashes Ulysses sometimes sends (e.g. /admin//posts/)
  const pathname = url.pathname.replace(/\/+/g, '/')
  const postIdMatch = pathname.match(/^\/ghost\/api\/(?:v4\/)?admin\/posts\/([^/]+)\/?$/)

  if (req.method === 'GET' && postIdMatch) {
    return handleGet(postIdMatch[1])
  }

  if (req.method === 'POST' && !postIdMatch) {
    return handleCreate(req)
  }

  if (req.method === 'PUT' && postIdMatch) {
    return handleUpdate(req, postIdMatch[1])
  }

  return new Response('Method Not Allowed', { status: 405 })
}

export const config: Config = {
  path: [
    '/ghost/api/v4/admin/posts/',
    '/ghost/api/v4/admin/posts/*',
    '/ghost/api/admin/posts/',
    '/ghost/api/admin/posts/*',
  ],
}
