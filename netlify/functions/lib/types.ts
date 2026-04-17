export type FollowerRecord = {
  actorId: string          // e.g. "https://mastodon.social/users/someone"
  inboxUrl: string         // personal inbox URL
  sharedInboxUrl?: string  // shared inbox for the instance (prefer this for delivery)
  followedAt: string       // ISO8601
}

export type FeedPost = {
  url: string
  date: string    // ISO8601
  title: string
  summary: string
  content: string // rendered HTML from Hugo
  section: 'blog' | 'micro'
}
