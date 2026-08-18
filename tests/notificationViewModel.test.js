import test from 'node:test'
import assert from 'node:assert/strict'
import {
  formatNotificationAmount,
  formatNotificationDate,
  getNotificationViewState,
  getUnreadBadgeCount,
} from '../src/components/serviceType/notification/notificationViewModel.js'

test('unread badge is capped at 99 plus', () => {
  assert.equal(getUnreadBadgeCount(0), 0)
  assert.equal(getUnreadBadgeCount(4), 4)
  assert.equal(getUnreadBadgeCount(100), '99+')
})

test('notification formats amount and date for Vietnamese UI', () => {
  assert.match(formatNotificationAmount(299000), /299\.000/)
  assert.match(formatNotificationDate('2026-08-18T09:00:00.000Z'), /18\/08\/2026/)
})

test('notification view state distinguishes loading, error, empty, and ready', () => {
  assert.equal(
    getNotificationViewState({ isLoading: true, hasError: false, notifications: [] }),
    'loading',
  )
  assert.equal(
    getNotificationViewState({ isLoading: false, hasError: true, notifications: [] }),
    'error',
  )
  assert.equal(
    getNotificationViewState({ isLoading: false, hasError: false, notifications: [] }),
    'empty',
  )
  assert.equal(
    getNotificationViewState({ isLoading: false, hasError: false, notifications: [{ id: '1' }] }),
    'ready',
  )
})
