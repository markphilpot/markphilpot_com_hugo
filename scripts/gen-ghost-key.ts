import { randomBytes } from 'node:crypto'

const id = randomBytes(12).toString('hex')      // 24 hex chars
const secret = randomBytes(32).toString('hex')  // 64 hex chars

console.log(`GHOST_ADMIN_API_KEY=${id}:${secret}`)
console.log()
console.log('Add this to Netlify environment variables.')
console.log('Paste the same value into Ulysses → Accounts → Ghost → API Key.')
