import { getStore } from '@netlify/blobs'
import type { FollowerRecord } from './types.js'

function followersStore() {
  return getStore('ap-followers')
}

function stateStore() {
  return getStore('ap-state')
}

function followerKey(actorId: string): string {
  return Buffer.from(actorId).toString('base64url')
}

export async function getFollower(actorId: string): Promise<FollowerRecord | null> {
  return followersStore().get(followerKey(actorId), { type: 'json' })
}

export async function setFollower(record: FollowerRecord): Promise<void> {
  await followersStore().setJSON(followerKey(record.actorId), record)
}

export async function removeFollower(actorId: string): Promise<void> {
  await followersStore().delete(followerKey(actorId))
}

export async function listFollowers(): Promise<FollowerRecord[]> {
  const store = followersStore()
  const { blobs } = await store.list()
  const results = await Promise.allSettled(
    blobs.map((b) => store.get(b.key, { type: 'json' }) as Promise<FollowerRecord | null>),
  )
  return results
    .filter((r): r is PromiseFulfilledResult<FollowerRecord | null> => r.status === 'fulfilled')
    .map((r) => r.value)
    .filter((v): v is FollowerRecord => v !== null)
}

export async function getDelivered(): Promise<string[]> {
  return (await stateStore().get('delivered', { type: 'json' })) ?? []
}

export async function setDelivered(urls: string[]): Promise<void> {
  await stateStore().setJSON('delivered', urls)
}
