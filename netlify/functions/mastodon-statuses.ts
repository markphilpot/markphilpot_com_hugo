import type { Config } from '@netlify/functions'
import { verifyToken } from './lib/blobs.js'
import { createFile } from './lib/github.js'
import { feedPostToStatus } from './lib/mastodon.js'
import type { FeedPost } from './lib/types.js'

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!token) return new Response('Unauthorized', { status: 401 })

  const record = await verifyToken(token)
  if (!record) return new Response('Unauthorized', { status: 401 })

  const githubToken = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const domain = process.env.AP_MASTODON_DOMAIN ?? 'markphilpot.com'

  if (!githubToken || !owner || !repo) {
    console.error('mastodon-statuses: missing GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO')
    return new Response('Server configuration error', { status: 500 })
  }

  let statusText: string
  const contentType = req.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await req.json() as { status?: string }
    statusText = body.status ?? ''
  } else {
    const text = await req.text()
    statusText = new URLSearchParams(text).get('status') ?? ''
  }

  if (!statusText.trim()) {
    return new Response(
      JSON.stringify({ error: 'Validation failed', details: 'status is required' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const now = new Date()
  const year = now.getUTCFullYear()
  const baseSlug = now.toISOString().split('.')[0].toLowerCase().replace(/:/g, '-')
  const commitMessage = `micro: ${statusText.slice(0, 60).replace(/\n/g, ' ')}`
  const isoDate = now.toISOString().split('.')[0]

  let slug = baseSlug
  for (let attempt = 1; attempt <= 3; attempt++) {
    if (attempt > 1) slug = `${baseSlug}-${attempt}`
    const filePath = `content/micro-client/${year}/${slug}.md`
    const fileContent = `---\ndate: '${isoDate}'\nshowReadingTime: false\n---\n\n${statusText}`

    try {
      await createFile({ owner, repo, path: filePath, message: commitMessage, content: fileContent, token: githubToken })
      break
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      if (message.includes('422') && attempt < 3) continue
      console.error('mastodon-statuses: GitHub commit failed', err)
      return new Response('Failed to save post', { status: 500 })
    }
  }

  const postUrl = `https://${domain}/micro-client/${year}/${slug}/`
  const post: FeedPost = {
    url: postUrl,
    date: now.toISOString(),
    title: '',
    summary: '',
    content: `<p>${statusText.replace(/\n/g, '<br />')}</p>`,
    section: 'micro-client',
  }

  return new Response(JSON.stringify(feedPostToStatus(post, domain)), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config: Config = {
  path: '/api/v1/statuses',
}
