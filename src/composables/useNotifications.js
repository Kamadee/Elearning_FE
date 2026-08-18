import { computed, unref } from 'vue'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useCounterStore } from '@/stores/authStore'
import useAPI from '@/composables/useAPI'
import apiEndpoints from '@/config/apiEndpoints'
import {
  createNotificationUiState,
  markNotificationReadInPage,
  mergeNotificationIntoPage,
  normalizeNotification,
  normalizeNotificationListResponse,
} from './notificationQuery'
import {
  NOTIFICATION_QUERY_PREFIX,
  notificationCustomerQueryKey,
  notificationListQueryKey,
} from './notificationQueryKeys'

const NOTIFICATION_STALE_TIME = 5 * 60 * 1000

const getNotificationPage = async (page, perPage) => {
  const { _get } = useAPI()
  const response = await _get(
    apiEndpoints.CUSTOMER_NOTIFICATIONS,
    { page, per_page: perPage },
    { headers: { 'X-Requires-Auth': 'true' } },
  )

  return normalizeNotificationListResponse(response)
}

const markNotificationRead = async (notificationId) => {
  const { _patch } = useAPI()
  const response = await _patch(
    apiEndpoints.CUSTOMER_NOTIFICATION_READ(notificationId),
    {},
    { headers: { 'X-Requires-Auth': 'true' } },
  )

  return normalizeNotification(response?.data ?? response)
}

export const useNotifications = ({ customerId, page = 1, perPage = 10 } = {}) => {
  const store = useCounterStore()
  const queryClient = useQueryClient()
  const resolvedCustomerId = computed(() => unref(customerId) ?? store.getUser?.id ?? null)
  const resolvedPage = computed(() => Number(unref(page) ?? 1))
  const resolvedPerPage = computed(() => Number(unref(perPage) ?? 10))

  const query = useQuery({
    queryKey: computed(() =>
      notificationListQueryKey(resolvedCustomerId.value, resolvedPage.value, resolvedPerPage.value),
    ),
    queryFn: () => getNotificationPage(resolvedPage.value, resolvedPerPage.value),
    enabled: computed(() => Boolean(resolvedCustomerId.value)),
    staleTime: NOTIFICATION_STALE_TIME,
    refetchInterval: false,
    placeholderData: keepPreviousData,
  })
  const notificationUiState = createNotificationUiState(query)

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({
        queryKey: notificationCustomerQueryKey(resolvedCustomerId.value),
      })
      const snapshots = queryClient.getQueriesData({
        queryKey: notificationCustomerQueryKey(resolvedCustomerId.value),
      })
      const optimisticReadAt = new Date().toISOString()

      snapshots.forEach(([queryKey, pageData]) => {
        if (!pageData) return
        queryClient.setQueryData(
          queryKey,
          markNotificationReadInPage(pageData, notificationId, optimisticReadAt),
        )
      })

      return { snapshots }
    },
    onError: (_error, _notificationId, context) => {
      context?.snapshots?.forEach(([queryKey, pageData]) => {
        queryClient.setQueryData(queryKey, pageData)
      })
    },
    onSuccess: (updatedNotification) => {
      const pages = queryClient.getQueriesData({
        queryKey: notificationCustomerQueryKey(resolvedCustomerId.value),
      })
      pages.forEach(([queryKey, pageData]) => {
        if (!pageData) return
        queryClient.setQueryData(
          queryKey,
          markNotificationReadInPage(pageData, updatedNotification.id, updatedNotification.read_at),
        )
      })
    },
  })

  const mergeRealtimeNotification = (incomingNotification) => {
    const incoming = normalizeNotification(incomingNotification)
    const pages = queryClient.getQueriesData({
      queryKey: notificationCustomerQueryKey(resolvedCustomerId.value),
    })
    pages.forEach(([queryKey, pageData]) => {
      if (!pageData) return
      queryClient.setQueryData(queryKey, mergeNotificationIntoPage(pageData, incoming))
    })
  }

  const refetchAfterReconnect = () =>
    queryClient.invalidateQueries({
      queryKey: NOTIFICATION_QUERY_PREFIX,
    })

  return {
    ...query,
    ...notificationUiState,
    notifications: computed(() => query.data.value?.data ?? []),
    unreadCount: computed(() => query.data.value?.meta?.unread_count ?? 0),
    markRead: markReadMutation.mutateAsync,
    isMarkingRead: markReadMutation.isPending,
    markingReadId: computed(() =>
      markReadMutation.isPending.value ? markReadMutation.variables.value : null,
    ),
    markReadError: markReadMutation.error,
    actionError: computed(() => markReadMutation.error.value?.message ?? ''),
    mergeRealtimeNotification,
    refetchAfterReconnect,
  }
}
