import { readFile } from 'node:fs/promises'
import test from 'node:test'
import assert from 'node:assert/strict'

test('Vercel routes direct SPA requests to the Vue entry document', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'))

  assert.deepEqual(config.rewrites, [
    {
      source: '/(.*)',
      destination: '/index.html'
    }
  ])
})
