import { generateKeyPairSync } from 'node:crypto'

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
})

console.log('=== AP_PUBLIC_KEY_PEM ===')
console.log(publicKey)
console.log('=== AP_PRIVATE_KEY_PEM ===')
console.log(privateKey)
console.log('')
console.log('Set these as Netlify environment variables.')
console.log('⚠️  Do NOT commit the private key to git.')
