import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createFile, createCommit } from './github.js'

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

describe('createCommit', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  function mockSequence(...responses: Response[]) {
    const mockFetch = vi.spyOn(globalThis, 'fetch')
    responses.forEach((r) => mockFetch.mockResolvedValueOnce(r))
    return mockFetch
  }

  function okJson(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), { status })
  }

  const baseOpts = {
    owner: 'foo',
    repo: 'bar',
    branch: 'main',
    message: 'test commit',
    token: 'ghp_test',
    textFiles: [{ path: 'content/micro-client/2026/slug/index.md', content: 'hello' }],
    binaryFiles: [] as { path: string; data: ArrayBuffer }[],
  }

  it('calls Git Data API in correct order and returns commit sha and url', async () => {
    const mockFetch = mockSequence(
      okJson({ object: { sha: 'head-sha' } }),
      okJson({ tree: { sha: 'base-tree-sha' } }),
      okJson({ sha: 'blob-sha-1' }, 201),
      okJson({ sha: 'new-tree-sha' }, 201),
      okJson({ sha: 'new-commit-sha', html_url: 'https://github.com/foo/bar/commit/new-commit-sha' }, 201),
      okJson({ object: { sha: 'new-commit-sha' } }),
    )

    const result = await createCommit(baseOpts)

    expect(mockFetch).toHaveBeenCalledTimes(6)
    expect(result.sha).toBe('new-commit-sha')
    expect(result.url).toBe('https://github.com/foo/bar/commit/new-commit-sha')
  })

  it('creates blobs for both text and binary files', async () => {
    const mockFetch = mockSequence(
      okJson({ object: { sha: 'head-sha' } }),
      okJson({ tree: { sha: 'base-tree-sha' } }),
      okJson({ sha: 'blob-sha-1' }, 201),
      okJson({ sha: 'blob-sha-2' }, 201),
      okJson({ sha: 'new-tree-sha' }, 201),
      okJson({ sha: 'new-commit-sha', html_url: 'https://github.com' }, 201),
      okJson({}),
    )

    await createCommit({
      ...baseOpts,
      binaryFiles: [{ path: 'content/micro-client/2026/slug/photo.jpg', data: new Uint8Array([1, 2, 3]).buffer }],
    })

    expect(mockFetch).toHaveBeenCalledTimes(7)
    const blobCall1 = vi.mocked(fetch).mock.calls[2]
    const blobCall2 = vi.mocked(fetch).mock.calls[3]
    expect(blobCall1[0]).toContain('/git/blobs')
    expect(blobCall2[0]).toContain('/git/blobs')
  })

  it('base64-encodes text file content in blob POST', async () => {
    mockSequence(
      okJson({ object: { sha: 'h' } }),
      okJson({ tree: { sha: 't' } }),
      okJson({ sha: 'b1' }, 201),
      okJson({ sha: 'nt' }, 201),
      okJson({ sha: 'nc', html_url: 'https://github.com' }, 201),
      okJson({}),
    )

    await createCommit({ ...baseOpts, textFiles: [{ path: 'f.md', content: 'hello world' }] })

    const blobBody = JSON.parse(vi.mocked(fetch).mock.calls[2][1]!.body as string)
    expect(blobBody.content).toBe(Buffer.from('hello world', 'utf8').toString('base64'))
    expect(blobBody.encoding).toBe('base64')
  })

  it('throws when any GitHub API call returns non-2xx', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('{"message":"Not Found"}', { status: 404 }),
    )

    await expect(createCommit(baseOpts)).rejects.toThrow('GitHub API 404')
  })

  it('uses correct Authorization header', async () => {
    mockSequence(
      okJson({ object: { sha: 'h' } }),
      okJson({ tree: { sha: 't' } }),
      okJson({ sha: 'b' }, 201),
      okJson({ sha: 'nt' }, 201),
      okJson({ sha: 'nc', html_url: 'https://github.com' }, 201),
      okJson({}),
    )

    await createCommit(baseOpts)

    const [, init] = vi.mocked(fetch).mock.calls[0]
    const headers = init!.headers as Record<string, string>
    expect(headers['Authorization']).toBe('Bearer ghp_test')
  })
})
