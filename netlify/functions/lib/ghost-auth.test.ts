import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createHmac } from 'node:crypto'
import { validateGhostJWT } from './ghost-auth.js'

const TEST_ID = 'aabbccddeeff00112233aabb'
const TEST_SECRET = 'aabbccddeeff00112233aabbccddeeff00112233aabbccddeeff00112233aabb'

function makeJWT(overrides: {
  kid?: string
  alg?: string
  aud?: string | string[]
  exp?: number
} = {}): string {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: overrides.alg ?? 'HS256', kid: overrides.kid ?? TEST_ID, typ: 'JWT' }
  const payload = { iat: now, exp: overrides.exp ?? now + 300, aud: overrides.aud ?? '/admin/' }
  const h = Buffer.from(JSON.stringify(header)).toString('base64url')
  const p = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', Buffer.from(TEST_SECRET, 'hex'))
    .update(`${h}.${p}`)
    .digest('base64url')
  return `${h}.${p}.${sig}`
}

describe('validateGhostJWT', () => {
  beforeEach(() => {
    vi.stubEnv('GHOST_ADMIN_API_KEY', `${TEST_ID}:${TEST_SECRET}`)
  })
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns true for a valid token', () => {
    expect(validateGhostJWT(`Ghost ${makeJWT()}`)).toBe(true)
  })

  it('returns false when prefix is not "Ghost "', () => {
    expect(validateGhostJWT(`Bearer ${makeJWT()}`)).toBe(false)
    expect(validateGhostJWT(makeJWT())).toBe(false)
  })

  it('returns false when token is expired', () => {
    const now = Math.floor(Date.now() / 1000)
    expect(validateGhostJWT(`Ghost ${makeJWT({ exp: now - 1 })}`)).toBe(false)
  })

  it('returns false when kid does not match the configured id', () => {
    expect(validateGhostJWT(`Ghost ${makeJWT({ kid: 'wrongid' })}`)).toBe(false)
  })

  it('returns false when aud is not "/admin/"', () => {
    expect(validateGhostJWT(`Ghost ${makeJWT({ aud: '/content/' })}`)).toBe(false)
  })

  it('returns true when aud is an array containing a versioned /admin/ path (Ulysses format)', () => {
    const aud = ['/v3/admin/', '/v4/admin/', '/v5/admin/']
    expect(validateGhostJWT(`Ghost ${makeJWT({ aud })}`)).toBe(true)
  })

  it('returns false when aud array contains no /admin/ paths', () => {
    expect(validateGhostJWT(`Ghost ${makeJWT({ aud: ['/content/', '/public/'] })}`)).toBe(false)
  })

  it('returns false when signature is tampered', () => {
    const jwt = makeJWT()
    const [h, p] = jwt.split('.')
    expect(validateGhostJWT(`Ghost ${h}.${p}.invalidsignature`)).toBe(false)
  })

  it('returns false when GHOST_ADMIN_API_KEY is not set', () => {
    vi.unstubAllEnvs()
    expect(validateGhostJWT(`Ghost ${makeJWT()}`)).toBe(false)
  })

  it('returns false when token has wrong number of parts', () => {
    expect(validateGhostJWT('Ghost notajwt')).toBe(false)
  })
})
