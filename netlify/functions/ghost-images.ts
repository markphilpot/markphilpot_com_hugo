import type { Config } from '@netlify/functions'
import { randomUUID } from 'node:crypto'
import { validateGhostJWT } from './lib/ghost-auth.js'
import { setMediaUpload, setMediaBytes } from './lib/blobs.js'
import type { MediaUploadRecord } from './lib/types.js'

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  if (!validateGhostJWT(req.headers.get('authorization') ?? '')) {
    return new Response('Unauthorized', { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return new Response(
      JSON.stringify({ errors: [{ message: 'file is required' }] }),
      { status: 422, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const id = randomUUID()
  const originalExt = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const filename = `${id}.${originalExt}`

  const meta: MediaUploadRecord = {
    id,
    filename,
    mimeType: file.type || 'image/jpeg',
    description: null,
    uploadedAt: new Date().toISOString(),
  }

  const bytes = await file.arrayBuffer()
  await setMediaUpload(id, meta)
  await setMediaBytes(id, bytes)

  const domain = process.env.AP_MASTODON_DOMAIN ?? 'markphilpot.com'
  const url = `https://${domain}/.ghost-img/${id}`

  return new Response(
    JSON.stringify({ images: [{ url, ref: null }] }),
    { headers: { 'Content-Type': 'application/json' } },
  )
}

export const config: Config = {
  path: '/ghost/api/admin/images/upload/',
}
