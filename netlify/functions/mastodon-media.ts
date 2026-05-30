import type { Config } from '@netlify/functions'
import { randomUUID } from 'node:crypto'
import { verifyToken, setMediaUpload, getMediaUpload, setMediaBytes } from './lib/blobs.js'
import type { MastodonMediaAttachment } from './lib/mastodon.js'
import type { MediaUploadRecord } from './lib/types.js'

function attachmentFromRecord(record: MediaUploadRecord): MastodonMediaAttachment {
  return {
    id: record.id,
    type: 'image',
    url: null,
    preview_url: null,
    description: record.description,
    meta: {},
  }
}

export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url)
  const pathname = url.pathname

  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!token) return new Response('Unauthorized', { status: 401 })

  const tokenRecord = await verifyToken(token)
  if (!tokenRecord) return new Response('Unauthorized', { status: 401 })

  if (
    req.method === 'POST' &&
    (pathname === '/api/v1/media' || pathname === '/api/v2/media')
  ) {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: 'file is required' }),
        { status: 422, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const id = randomUUID()
    const description = (formData.get('description') as string | null) ?? null
    const meta: MediaUploadRecord = {
      id,
      filename: file.name,
      mimeType: file.type || 'application/octet-stream',
      description,
      uploadedAt: new Date().toISOString(),
    }

    const bytes = await file.arrayBuffer()
    await setMediaUpload(id, meta)
    await setMediaBytes(id, bytes)

    const statusCode = pathname === '/api/v2/media' ? 202 : 200
    return new Response(JSON.stringify(attachmentFromRecord(meta)), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const pollMatch = pathname.match(/^\/api\/v1\/media\/([^/]+)$/)
  if (req.method === 'GET' && pollMatch) {
    const id = pollMatch[1]
    const meta = await getMediaUpload(id)
    if (!meta) return new Response('Not Found', { status: 404 })
    return new Response(JSON.stringify(attachmentFromRecord(meta)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response('Not Found', { status: 404 })
}

export const config: Config = {
  path: ['/api/v1/media', '/api/v1/media/*', '/api/v2/media'],
}
