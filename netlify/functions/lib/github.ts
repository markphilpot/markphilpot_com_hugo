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
