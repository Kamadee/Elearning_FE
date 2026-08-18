const RECONNECTABLE_STATES = new Set(['disconnected', 'unavailable'])

export const subscribeToOrderPaymentChannel = ({
  echo,
  customerId,
  onNotification,
  onReconnect,
}) => {
  const channelName = `customers.${customerId}`
  const channel = echo.private(channelName)
  const connection = echo.connector?.pusher?.connection

  channel.listen('.order.payment.completed', onNotification)

  const handleStateChange = (state) => {
    if (state.current === 'connected' && RECONNECTABLE_STATES.has(state.previous)) {
      onReconnect?.()
    }
  }

  connection?.bind?.('state_change', handleStateChange)

  return () => {
    connection?.unbind?.('state_change', handleStateChange)
    echo.leave(channelName)
  }
}
