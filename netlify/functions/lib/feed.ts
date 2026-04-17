import type { FeedPost } from './types.js'

type RawEntry = {
  url: string
  date: string
  title: string
  summary: string
  content: string
  section: string
}

export function parseFeedEntries(entries: RawEntry[]): FeedPost[] {
  return entries
    .filter((e) => e.url && e.date && (e.section === 'blog' || e.section === 'micro'))
    .map((e) => ({
      url: e.url,
      date: e.date,
      title: e.title ?? '',
      summary: e.summary ?? '',
      content: e.content ?? '',
      section: e.section as 'blog' | 'micro',
    }))
}

export async function fetchFeed(baseUrl = 'https://markphilpot.com'): Promise<FeedPost[]> {
  const res = await fetch(`${baseUrl}/ap-feed.json`)
  if (!res.ok) throw new Error(`Failed to fetch feed: ${res.status} ${res.statusText}`)
  const entries = (await res.json()) as RawEntry[]
  return parseFeedEntries(entries)
}
