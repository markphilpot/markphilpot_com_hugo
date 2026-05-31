export type FollowerRecord = {
  actorId: string
  inboxUrl: string
  sharedInboxUrl?: string
  followedAt: string
}

export type FeedPost = {
  url: string
  date: string
  title: string
  summary: string
  content: string
  section: 'blog' | 'micro' | 'micro-client' | 'direct'
}

export type MastodonAppRecord = {
  clientId: string
  clientSecret: string
  name: string
  redirectUri: string
  createdAt: string
}

export type MastodonCodeRecord = {
  code: string
  clientId: string
  redirectUri: string
  createdAt: string
}

export type MastodonTokenRecord = {
  token: string
  clientId: string
  createdAt: string
}

export type MediaUploadRecord = {
  id: string
  filename: string
  mimeType: string
  description: string | null
  uploadedAt: string
}

export type GhostPostRecord = {
  ghostId: string
  slug: string
  year: number
  path: string        // e.g. "content/direct/2026/my-post/index.md"
  createdAt: string   // ISO timestamp — year is derived from this on create, stays fixed on update
}
