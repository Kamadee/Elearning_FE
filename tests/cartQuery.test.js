import test from 'node:test';
import assert from 'node:assert/strict';
import { QueryClient } from '@tanstack/vue-query';
import { CART_QUERY_KEY, invalidateCart } from '../src/composables/cartQuery.js';

test('invalidating cart marks the cached cart query stale for refetch', async () => {
  const queryClient = new QueryClient();
  queryClient.setQueryData(CART_QUERY_KEY, { contents: [{ id: 1 }] });

  await invalidateCart(queryClient);

  assert.equal(queryClient.getQueryState(CART_QUERY_KEY)?.isInvalidated, true);
});
