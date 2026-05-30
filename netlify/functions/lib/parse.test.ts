import { describe, it, expect } from 'vitest'
import { parseBodyMulti, parseMediaIds } from './parse.js'

describe('parseBodyMulti', () => {
  it('parses repeated URL-encoded keys as an array', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: 'status=hello&media_ids%5B%5D=uuid1&media_ids%5B%5D=uuid2',
    })
    const body = await parseBodyMulti(req)
    expect(body['media_ids[]']).toEqual(['uuid1', 'uuid2'])
    expect(body['status']).toBe('hello')
  })

  it('parses a single URL-encoded value as a string not an array', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: 'status=hello+world',
    })
    const body = await parseBodyMulti(req)
    expect(body['status']).toBe('hello world')
  })

  it('parses JSON body preserving arrays', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: 'hello', media_ids: ['uuid1', 'uuid2'] }),
    })
    const body = await parseBodyMulti(req)
    expect(body['media_ids']).toEqual(['uuid1', 'uuid2'])
    expect(body['status']).toBe('hello')
  })
})

describe('parseMediaIds', () => {
  it('extracts media_ids[] (URL-encoded form style)', () => {
    expect(parseMediaIds({ 'media_ids[]': ['id1', 'id2'] })).toEqual(['id1', 'id2'])
  })

  it('extracts media_ids (JSON style)', () => {
    expect(parseMediaIds({ 'media_ids': ['id1', 'id2'] })).toEqual(['id1', 'id2'])
  })

  it('handles single string value for media_ids', () => {
    expect(parseMediaIds({ 'media_ids': 'id1' })).toEqual(['id1'])
  })

  it('returns empty array when no media_ids present', () => {
    expect(parseMediaIds({ status: 'hello' })).toEqual([])
  })

  it('filters out empty strings', () => {
    expect(parseMediaIds({ 'media_ids[]': ['id1', '', 'id2'] })).toEqual(['id1', 'id2'])
  })
})
