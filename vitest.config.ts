import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['netlify/**/*.test.ts', 'scripts/**/*.test.ts'],
    environment: 'node',
  },
})
