export const getUnreadBadgeCount = (unreadCount) => {
  const count = Number(unreadCount ?? 0)
  return count > 99 ? '99+' : count
}

export const formatNotificationAmount = (amount) => {
  const numericAmount = Number(amount)
  if (!Number.isFinite(numericAmount)) return ''

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(numericAmount)
}

export const formatNotificationDate = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export const getNotificationViewState = ({ isLoading, hasError, notifications }) => {
  if (isLoading) return 'loading'
  if (hasError) return 'error'
  if (!notifications?.length) return 'empty'
  return 'ready'
}
