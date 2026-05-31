import { getStore } from '@netlify/blobs'
import type { GhostPostRecord } from './types.js'

function ghostPostsStore() {
  return getStore('ghost-posts')
}

export async function setGhostPost(record: GhostPostRecord): Promise<void> {
  await ghostPostsStore().setJSON(record.ghostId, record)
}

export async function getGhostPost(ghostId: string): Promise<GhostPostRecord | null> {
  return ghostPostsStore().get(ghostId, { type: 'json' })
}
