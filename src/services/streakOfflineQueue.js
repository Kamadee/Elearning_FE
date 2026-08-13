const DB_NAME = 'elearning-learning-streak';
const STORE_NAME = 'pending-events';
const notifyQueueChanged = () => globalThis.window?.dispatchEvent(new Event('learning-streak-queue-change'));

export const createStreakEventQueue = (store) => ({
  async enqueue(event) {
    await store.put({ ...event, attempts: event.attempts ?? 0, created_at: event.created_at ?? new Date().toISOString() });
    notifyQueueChanged();
  },
  async pendingFor(customerId) {
    return (await store.byCustomer(customerId)).sort((a, b) => a.captured_at.localeCompare(b.captured_at));
  },
  async flush(customerId, sender) {
    const events = await this.pendingFor(customerId);
    let lastResponse = null;
    for (const event of events) {
      try {
        lastResponse = await sender(event);
        await store.remove(event.event_id);
        notifyQueueChanged();
      } catch (error) {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          await store.remove(event.event_id);
          notifyQueueChanged();
          continue;
        }
        await store.put({ ...event, attempts: (event.attempts ?? 0) + 1, last_attempt_at: new Date().toISOString() });
        notifyQueueChanged();
        throw error;
      }
    }
    return lastResponse;
  },
  async clearCustomer(customerId) {
    const events = await store.byCustomer(customerId);
    await Promise.all(events.map((event) => store.remove(event.event_id)));
    notifyQueueChanged();
  },
});

const openDatabase = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, 1);
  request.onupgradeneeded = () => {
    const db = request.result;
    const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'event_id' });
    objectStore.createIndex('customer_id', 'customer_id', { unique: false });
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const browserStore = {
  async put(event) {
    const db = await openDatabase();
    await new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(event);
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
    });
    db.close();
  },
  async remove(eventId) {
    const db = await openDatabase();
    await new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(eventId);
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
    });
    db.close();
  },
  async byCustomer(customerId) {
    const db = await openDatabase();
    const events = await new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME).objectStore(STORE_NAME).index('customer_id').getAll(customerId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return events;
  },
};

export const streakOfflineQueue = typeof indexedDB === 'undefined'
  ? createStreakEventQueue({ put: async () => {}, remove: async () => {}, byCustomer: async () => [] })
  : createStreakEventQueue(browserStore);
