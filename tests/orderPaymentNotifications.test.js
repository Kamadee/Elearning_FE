import test from 'node:test'
import assert from 'node:assert/strict'
import { subscribeToOrderPaymentChannel } from '../src/services/realtime/orderPaymentChannel.js'

const createFakeEcho = () => {
  let listener = null
  let stateChangeHandler = null
  let leftChannel = null

  const channel = {
    listen(eventName, callback) {
      assert.equal(eventName, '.order.payment.completed')
      listener = callback
      return channel
    },
  }

  const echo = {
    connector: {
      pusher: {
        connection: {
          bind(eventName, callback) {
            assert.equal(eventName, 'state_change')
            stateChangeHandler = callback
          },
          unbind(eventName, callback) {
            assert.equal(eventName, 'state_change')
            assert.equal(callback, stateChangeHandler)
            stateChangeHandler = null
          },
        },
      },
    },
    private(channelName) {
      assert.equal(channelName, 'customers.9')
      return channel
    },
    leave(channelName) {
      leftChannel = channelName
    },
    emitNotification(payload) {
      listener(payload)
    },
    emitStateChange(state) {
      stateChangeHandler(state)
    },
    get leftChannel() {
      return leftChannel
    },
  }

  return echo
}

test('private order payment subscription listens and reconciles after reconnect', () => {
  const echo = createFakeEcho()
  const received = []
  let reconnects = 0
  const cleanup = subscribeToOrderPaymentChannel({
    echo,
    customerId: 9,
    onNotification: (payload) => received.push(payload),
    onReconnect: () => {
      reconnects += 1
    },
  })

  echo.emitNotification({ id: 'notification-1' })
  echo.emitStateChange({ previous: 'disconnected', current: 'connected' })
  cleanup()

  assert.deepEqual(received, [{ id: 'notification-1' }])
  assert.equal(reconnects, 1)
  assert.equal(echo.leftChannel, 'customers.9')
})

test('initial connection does not trigger missed-event reconciliation', () => {
  const echo = createFakeEcho()
  let reconnects = 0
  const cleanup = subscribeToOrderPaymentChannel({
    echo,
    customerId: 9,
    onNotification: () => {},
    onReconnect: () => {
      reconnects += 1
    },
  })

  echo.emitStateChange({ previous: 'connecting', current: 'connected' })
  cleanup()

  assert.equal(reconnects, 0)
})
