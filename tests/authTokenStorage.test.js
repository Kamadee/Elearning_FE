import test from 'node:test';
import assert from 'node:assert/strict';
import { createAuthTokenStore } from '../src/utils/authTokenStorage.js';

test('keeps the access token in memory and does not use localStorage', () => {
  const storage = createAuthTokenStore();

  storage.set('Bearer access-token');

  assert.equal(storage.get(), 'Bearer access-token');
  assert.equal(storage.hasPersistedToken(), false);
});
