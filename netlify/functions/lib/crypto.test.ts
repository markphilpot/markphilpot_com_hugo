import { describe, it, expect } from 'vitest'
import { generateKeyPairSync } from 'node:crypto'
import { signRequest, verifySignatureWithKey } from './crypto.js'

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
})

describe('signRequest', () => {
  it('returns Date, Digest, Signature, Content-Type headers', () => {
    const headers = signRequest('POST', 'https://example.com/inbox', '{"test":1}', privateKey)
    expect(headers['Date']).toBeDefined()
    expect(headers['Digest']).toMatch(/^SHA-256=/)
    expect(headers['Signature']).toContain('keyId=')
    expect(headers['Signature']).toContain('algorithm="rsa-sha256"')
    expect(headers['Content-Type']).toBe('application/activity+json')
  })
})

describe('verifySignatureWithKey', () => {
  it('verifies a signature produced by signRequest', () => {
    const body = '{"type":"Follow"}'
    const reqHeaders = signRequest('POST', 'https://example.com/inbox', body, privateKey)
    const incoming = Object.fromEntries(
      Object.entries(reqHeaders).map(([k, v]) => [k.toLowerCase(), v])
    )
    expect(verifySignatureWithKey('POST', '/inbox', incoming, publicKey)).toBe(true)
  })

  it('rejects when digest header is tampered', () => {
    const body = '{"type":"Follow"}'
    const reqHeaders = signRequest('POST', 'https://example.com/inbox', body, privateKey)
    const incoming = Object.fromEntries(
      Object.entries(reqHeaders).map(([k, v]) => [k.toLowerCase(), v])
    )
    // Tamper: change digest so the reconstructed signing string differs from what was signed
    incoming['digest'] = 'SHA-256=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
    expect(verifySignatureWithKey('POST', '/inbox', incoming, publicKey)).toBe(false)
  })

  it('rejects when signature header is absent', () => {
    expect(verifySignatureWithKey('POST', '/inbox', {}, publicKey)).toBe(false)
  })
})
