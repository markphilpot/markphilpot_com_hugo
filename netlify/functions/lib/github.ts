export type GitHubCreateFileOptions = {
  owner: string
  repo: string
  path: string
  message: string
  content: string
  token: string
}

export type GitHubCreateFileResult = {
  sha: string
  url: string
}

export async function createFile(opts: GitHubCreateFileOptions): Promise<GitHubCreateFileResult> {
  const url = `https://api.github.com/repos/${opts.owner}/${opts.repo}/contents/${opts.path}`
  const body = JSON.stringify({
    message: opts.message,
    content: Buffer.from(opts.content, 'utf8').toString('base64'),
  })
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${opts.token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GitHub API ${res.status}: ${text}`)
  }
  const data = await res.json() as { content: { sha: string; html_url: string } }
  return { sha: data.content.sha, url: data.content.html_url }
}

export type CommitFile = {
  path: string
  content: string
}

export type CommitBinaryFile = {
  path: string
  data: ArrayBuffer
}

export type GitHubCreateCommitOptions = {
  owner: string
  repo: string
  branch: string
  message: string
  token: string
  textFiles: CommitFile[]
  binaryFiles: CommitBinaryFile[]
}

export type GitHubCreateCommitResult = {
  sha: string
  url: string
}

export async function createCommit(opts: GitHubCreateCommitOptions): Promise<GitHubCreateCommitResult> {
  const base = `https://api.github.com/repos/${opts.owner}/${opts.repo}`
  const headers = {
    Authorization: `Bearer ${opts.token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  async function ghFetch(path: string, method: string, body?: unknown): Promise<unknown> {
    const res = await fetch(`${base}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`GitHub API ${res.status}: ${text}`)
    }
    return res.json()
  }

  const refData = await ghFetch(`/git/ref/heads/${opts.branch}`, 'GET') as { object: { sha: string } }
  const headSha = refData.object.sha

  const commitData = await ghFetch(`/git/commits/${headSha}`, 'GET') as { tree: { sha: string } }
  const baseTreeSha = commitData.tree.sha

  const treeEntries: { path: string; mode: string; type: string; sha: string }[] = []

  for (const f of opts.textFiles) {
    const blob = await ghFetch('/git/blobs', 'POST', {
      content: Buffer.from(f.content, 'utf8').toString('base64'),
      encoding: 'base64',
    }) as { sha: string }
    treeEntries.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha })
  }

  for (const f of opts.binaryFiles) {
    const blob = await ghFetch('/git/blobs', 'POST', {
      content: Buffer.from(f.data).toString('base64'),
      encoding: 'base64',
    }) as { sha: string }
    treeEntries.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha })
  }

  const newTree = await ghFetch('/git/trees', 'POST', {
    base_tree: baseTreeSha,
    tree: treeEntries,
  }) as { sha: string }

  const newCommit = await ghFetch('/git/commits', 'POST', {
    message: opts.message,
    tree: newTree.sha,
    parents: [headSha],
  }) as { sha: string; html_url: string }

  await ghFetch(`/git/refs/heads/${opts.branch}`, 'PATCH', {
    sha: newCommit.sha,
    force: false,
  })

  return { sha: newCommit.sha, url: newCommit.html_url }
}
