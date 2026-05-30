function parseMultipart(text: string, boundary: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const part of text.split(`--${boundary}`)) {
    const match = part.match(/\r\nContent-Disposition: form-data; name="([^"]+)"\r\n\r\n([\s\S]*?)\r\n$/)
    if (match) result[match[1]] = match[2]
  }
  return result
}

export async function parseBody(req: Request): Promise<Record<string, string>> {
  const contentType = req.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return req.json() as Promise<Record<string, string>>
  }
  const text = await req.text()
  if (contentType.includes('multipart/form-data')) {
    const boundary = contentType.match(/boundary=([^\s;]+)/)?.[1] ?? ''
    return parseMultipart(text, boundary)
  }
  return Object.fromEntries(new URLSearchParams(text))
}

export async function parseBodyMulti(req: Request): Promise<Record<string, string | string[]>> {
  const contentType = req.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return req.json() as Promise<Record<string, string | string[]>>
  }
  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData()
    const result: Record<string, string | string[]> = {}
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        if (key in result) {
          const existing = result[key]
          result[key] = Array.isArray(existing) ? [...existing, value] : [existing as string, value]
        } else {
          result[key] = value
        }
      }
    }
    return result
  }
  const text = await req.text()
  const params = new URLSearchParams(text)
  const result: Record<string, string | string[]> = {}
  for (const key of new Set(params.keys())) {
    const values = params.getAll(key)
    result[key] = values.length === 1 ? values[0] : values
  }
  return result
}

export function parseMediaIds(body: Record<string, string | string[]>): string[] {
  const raw = body['media_ids[]'] ?? body['media_ids'] ?? []
  if (Array.isArray(raw)) return raw.filter(Boolean)
  return raw ? [raw as string] : []
}
