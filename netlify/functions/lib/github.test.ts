import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createFile } from './github.js'

describe('createFile', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('calls GitHub API with correct URL', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ content: { sha: 'abc123', html_url: 'https://github.com/foo/bar/blob/main/file.md' } }),
        { status: 201 },
      ),
    )

    await createFile({
      owner: 'foo',
      repo: 'bar',
      path: 'content/micro-client/2026/file.md',
      message: 'micro: hello',
      content: 'hello world',
      token: 'ghp_test',
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/foo/bar/contents/content/micro-client/2026/file.md',
      expect.objectContaining({ method: 'PUT' }),
    )
  })

  it('sends correct Authorization and Accept headers', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ content: { sha: 'x', html_url: 'https://github.com' } }), { status: 201 }),
    )

    await createFile({ owner: 'foo', repo: 'bar', path: 'f.md', message: 'm', content: 'c', token: 'ghp_test' })

    const [, init] = vi.mocked(fetch).mock.calls[0]
    const headers = init!.headers as Record<string, string>
    expect(headers['Authorization']).toBe('Bearer ghp_test')
    expect(headers['Accept']).toBe('application/vnd.github+json')
  })

  it('base64-encodes the file content in the request body', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ content: { sha: 'x', html_url: 'https://github.com' } }), { status: 201 }),
    )

    await createFile({ owner: 'foo', repo: 'bar', path: 'f.md', message: 'test', content: 'hello world', token: 'tok' })

    const [, init] = vi.mocked(fetch).mock.calls[0]
    const body = JSON.parse(init!.body as string)
    expect(body.content).toBe(Buffer.from('hello world', 'utf8').toString('base64'))
    expect(body.message).toBe('test')
  })

  it('returns sha and url from the GitHub response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ content: { sha: 'deadbeef', html_url: 'https://github.com/foo/bar/file.md' } }),
        { status: 201 },
      ),
    )

    const result = await createFile({ owner: 'foo', repo: 'bar', path: 'f.md', message: 'm', content: 'c', token: 't' })
    expect(result).toEqual({ sha: 'deadbeef', url: 'https://github.com/foo/bar/file.md' })
  })

  it('throws with status code when GitHub returns non-2xx', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('{"message":"Already Exists"}', { status: 422 }),
    )

    await expect(
      createFile({ owner: 'foo', repo: 'bar', path: 'f.md', message: 'm', content: 'c', token: 't' }),
    ).rejects.toThrow('GitHub API 422')
  })
})
