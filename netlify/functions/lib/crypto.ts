import crypto from 'node:crypto'

const KEY_ID = 'https://markphilpot.com/ap/actor#main-key'

export function signRequest(
  method: string,
  url: string,
  body: string | null,
  privateKeyPem: string,
): Record<string, string> {
  const parsed = new URL(url)
  const date = new Date().toUTCString()
  const target = `${method.toLowerCase()} ${parsed.pathname}`

  const signingParts: string[] = [
    `(request-target): ${target}`,
    `host: ${parsed.host}`,
    `date: ${date}`,
  ]
  const signedHeaderNames = ['(request-target)', 'host', 'date']

  const result: Record<string, string> = {
    Date: date,
    Host: parsed.host,
  }

  if (body !== null) {
    const digest = 'SHA-256=' + crypto.createHash('sha256').update(body).digest('base64')
    signingParts.push(`digest: ${digest}`)
    signedHeaderNames.push('digest')
    result['Digest'] = digest
    result['Content-Type'] = 'application/activity+json'
  }

  const signingString = signingParts.join('\n')
  const privateKey = crypto.createPrivateKey(privateKeyPem)
  const signature = crypto
    .sign('sha256', Buffer.from(signingString), {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    })
    .toString('base64')

  result['Signature'] = [
    `keyId="${KEY_ID}"`,
    `algorithm="rsa-sha256"`,
    `headers="${signedHeaderNames.join(' ')}"`,
    `signature="${signature}"`,
  ].join(',')

  return result
}

/**
 * Verifies an HTTP Signature using an already-fetched public key PEM.
 * Reconstructs the signing string from incoming headers and verifies the RSA signature.
 * All header names in `headers` must be lowercase.
 */
export function verifySignatureWithKey(
  method: string,
  path: string,
  headers: Record<string, string>,
  publicKeyPem: string,
): boolean {
  const signatureHeader = headers['signature']
  if (!signatureHeader) return false

  const params: Record<string, string> = {}
  // Split on commas to get key="value" pairs. This is safe for standard HTTP Signatures
  // because base64-encoded signature values are comma-free (RFC 4648).
  for (const part of signatureHeader.split(',')) {
    const eqIdx = part.indexOf('=')
    if (eqIdx === -1) continue
    const k = part.slice(0, eqIdx).trim()
    const v = part.slice(eqIdx + 1).trim().replace(/^"|"$/g, '')
    params[k] = v
  }

  const { headers: signedHeaders, signature } = params
  if (!signedHeaders || !signature) return false

  const signingString = signedHeaders
    .split(' ')
    .map((h) => {
      if (h === '(request-target)') return `(request-target): ${method.toLowerCase()} ${path}`
      return `${h}: ${headers[h] ?? ''}`
    })
    .join('\n')

  try {
    const publicKey = crypto.createPublicKey(publicKeyPem)
    return crypto.verify(
      'sha256',
      Buffer.from(signingString),
      { key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
      Buffer.from(signature, 'base64'),
    )
  } catch {
    return false
  }
}

/**
 * Verifies an HTTP Signature by fetching the actor's public key from the keyId URL.
 * Signs the outbound fetch with our private key to support instances with authorized fetch enabled.
 */
export async function verifySignature(
  method: string,
  path: string,
  headers: Record<string, string>,
  privateKeyPem: string,
): Promise<boolean> {
  const signatureHeader = headers['signature']
  if (!signatureHeader) return false

  const keyIdMatch = signatureHeader.match(/keyId="([^"]+)"/)
  if (!keyIdMatch) return false
  const keyId = keyIdMatch[1]

  try {
    const actorUrl = keyId.split('#')[0]
    const signedGetHeaders = signRequest('GET', actorUrl, null, privateKeyPem)
    const res = await fetch(actorUrl, {
      headers: { ...signedGetHeaders, Accept: 'application/activity+json' },
    })
    if (!res.ok) return false
    const actor = (await res.json()) as { publicKey?: { publicKeyPem?: string } }
    const publicKeyPem = actor.publicKey?.publicKeyPem
    if (!publicKeyPem) return false
    return verifySignatureWithKey(method, path, headers, publicKeyPem)
  } catch (err) {
    console.error('verifySignature: exception', err)
    return false
  }
}
