const assertNotificationId = (notification) => {
  if (!notification || typeof notification !== 'object' || !notification.id) {
    throw new Error('Notification payload is missing id')
  }
}

export const normalizeNotification = (notification) => {
  assertNotificationId(notification)

  return {
    id: String(notification.id),
    type: String(notification.type ?? 'general'),
    title: String(notification.title ?? 'Thông báo'),
    message: String(notification.message ?? ''),
    order: notification.order ?? null,
    read_at: notification.read_at ?? null,
    created_at: notification.created_at ?? null,
  }
}

export const normalizeNotificationListResponse = (response) => {
  const responseData = response?.data
  const payload =
    responseData?.data && responseData?.meta ? responseData : (responseData ?? response)
  const items = Array.isArray(payload?.data) ? payload.data : []

  return {
    data: items.map(normalizeNotification),
    meta: {
      current_page: Number(payload?.meta?.current_page ?? 1),
      per_page: Number(payload?.meta?.per_page ?? 10),
      last_page: Number(payload?.meta?.last_page ?? 1),
      total: Number(payload?.meta?.total ?? items.length),
      unread_count: Number(payload?.meta?.unread_count ?? 0),
    },
  }
}

export const mergeNotificationIntoPage = (page, incomingNotification) => {
  const incoming = normalizeNotification(incomingNotification)
  const existingIndex = page.data.findIndex((item) => item.id === incoming.id)

  if (existingIndex >= 0) {
    const data = page.data.map((item) => (item.id === incoming.id ? incoming : item))
    return { ...page, data }
  }

  const maxItems = Number(page.meta?.per_page ?? page.data.length + 1)
  const data = [incoming, ...page.data].slice(0, maxItems)
  const unreadDelta = incoming.read_at ? 0 : 1

  return {
    ...page,
    data,
    meta: {
      ...page.meta,
      total: Number(page.meta?.total ?? page.data.length) + 1,
      unread_count: Number(page.meta?.unread_count ?? 0) + unreadDelta,
    },
  }
}

export const markNotificationReadInPage = (page, notificationId, readAt) => {
  const targetId = String(notificationId)
  const target = page.data.find((item) => item.id === targetId)

  if (!target || target.read_at) return page

  return {
    ...page,
    data: page.data.map((item) => (item.id === targetId ? { ...item, read_at: readAt } : item)),
    meta: {
      ...page.meta,
      unread_count: Math.max(0, Number(page.meta?.unread_count ?? 0) - 1),
    },
  }
}
