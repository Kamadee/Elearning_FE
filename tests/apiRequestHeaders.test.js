import test from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_API_HEADERS } from '../src/config/httpDefaults.js'

test('requests JSON responses so Laravel API validation does not redirect to the SPA', () => {
  assert.equal(DEFAULT_API_HEADERS.Accept, 'application/json')
  assert.equal(DEFAULT_API_HEADERS['Content-Type'], 'application/json')
})
