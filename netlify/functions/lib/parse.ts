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
