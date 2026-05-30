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
  section: 'blog' | 'micro' | 'micro-client'
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
