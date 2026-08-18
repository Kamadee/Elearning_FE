import { onUnmounted, ref, unref, watch } from 'vue'
import { useCounterStore } from '@/stores/authStore'
import { createEchoClient } from '@/services/realtime/echoClient'
import { subscribeToOrderPaymentChannel } from '@/services/realtime/orderPaymentChannel'

export { subscribeToOrderPaymentChannel } from '@/services/realtime/orderPaymentChannel'

export const useOrderPaymentNotifications = ({
  customerId,
  onNotification,
  onReconnect,
  echoFactory = createEchoClient,
} = {}) => {
  const store = useCounterStore()
  const cleanup = ref(null)
  const resolvedCustomerId = () => unref(customerId) ?? store.getUser?.id ?? null

  const stop = watch(
    resolvedCustomerId,
    (nextCustomerId) => {
      cleanup.value?.()
      cleanup.value = null

      if (!nextCustomerId) return

      const echo = echoFactory()
      cleanup.value = subscribeToOrderPaymentChannel({
        echo,
        customerId: nextCustomerId,
        onNotification,
        onReconnect,
      })
    },
    { immediate: true },
  )

  const disconnect = () => {
    stop()
    cleanup.value?.()
    cleanup.value = null
  }

  onUnmounted(disconnect)

  return { disconnect }
}
