import test from 'node:test'
import assert from 'node:assert/strict'
import {
  markNotificationReadInPage,
  mergeNotificationIntoPage,
  normalizeNotificationListResponse,
} from '../src/composables/notificationQuery.js'
import { notificationListQueryKey } from '../src/composables/notificationQueryKeys.js'

const notification = (id, readAt = null) => ({
  id,
  type: 'order_payment_completed',
  title: 'Thanh toán thành công',
  message: `Đơn hàng ${id} đã được thanh toán thành công.`,
  order: {
    id: Number(id),
    code: `OD-${id}`,
    amount: 299000,
    status: 'completed',
    payment_time: '2026-08-18T09:00:00.000Z',
  },
  read_at: readAt,
  created_at: '2026-08-18T09:00:00.000Z',
})

test('notification query keys include customer and pagination inputs', () => {
  assert.notDeepEqual(notificationListQueryKey(9, 1, 10), notificationListQueryKey(9, 2, 10))
  assert.notDeepEqual(notificationListQueryKey(9, 1, 10), notificationListQueryKey(10, 1, 10))
})

test('notification list response is normalized from the API envelope', () => {
  const normalized = normalizeNotificationListResponse({
    message: 'success',
    data: {
      data: [notification('1')],
      meta: { current_page: 1, per_page: 10, last_page: 1, total: 1, unread_count: 1 },
    },
  })

  assert.deepEqual(normalized.data, [notification('1')])
  assert.equal(normalized.meta.unread_count, 1)
})

test('realtime notification is prepended once and updates unread count', () => {
  const existing = notification('1')
  const page = {
    data: [existing],
    meta: { current_page: 1, per_page: 10, last_page: 1, total: 1, unread_count: 1 },
  }

  const merged = mergeNotificationIntoPage(page, notification('2'))
  const duplicate = mergeNotificationIntoPage(merged, notification('2'))

  assert.deepEqual(
    merged.data.map((item) => item.id),
    ['2', '1'],
  )
  assert.equal(merged.meta.total, 2)
  assert.equal(merged.meta.unread_count, 2)
  assert.deepEqual(duplicate, merged)
})

test('marking a notification read does not mutate the previous page', () => {
  const page = {
    data: [notification('1'), notification('2')],
    meta: { current_page: 1, per_page: 10, last_page: 1, total: 2, unread_count: 2 },
  }

  const updated = markNotificationReadInPage(page, '1', '2026-08-18T10:00:00.000Z')

  assert.equal(page.data[0].read_at, null)
  assert.equal(updated.data[0].read_at, '2026-08-18T10:00:00.000Z')
  assert.equal(updated.meta.unread_count, 1)
})
