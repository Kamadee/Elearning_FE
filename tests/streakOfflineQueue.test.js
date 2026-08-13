import test from 'node:test';
import assert from 'node:assert/strict';
import { createStreakEventQueue } from '../src/services/streakOfflineQueue.js';

const createMemoryStore = () => {
  const values = new Map();
  return {
    async put(event) { values.set(event.event_id, event); },
    async remove(id) { values.delete(id); },
    async byCustomer(customerId) { return [...values.values()].filter((event) => event.customer_id === customerId); },
  };
};

test('keeps a failed event and removes it only after acknowledgement', async () => {
  const queue = createStreakEventQueue(createMemoryStore());
  await queue.enqueue({ event_id: 'event-1', customer_id: 1, captured_at: '2026-08-12T10:00:00+07:00' });

  await assert.rejects(() => queue.flush(1, async () => { throw new Error('offline'); }));
  assert.equal((await queue.pendingFor(1)).length, 1);

  await queue.flush(1, async () => ({ ok: true }));
  assert.equal((await queue.pendingFor(1)).length, 0);
});

test('does not flush events from another customer', async () => {
  const queue = createStreakEventQueue(createMemoryStore());
  await queue.enqueue({ event_id: 'event-1', customer_id: 1, captured_at: '2026-08-12T10:00:00+07:00' });
  await queue.enqueue({ event_id: 'event-2', customer_id: 2, captured_at: '2026-08-12T10:00:01+07:00' });

  await queue.flush(1, async () => ({ ok: true }));

  assert.equal((await queue.pendingFor(1)).length, 0);
  assert.equal((await queue.pendingFor(2)).length, 1);
});
