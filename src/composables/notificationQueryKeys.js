export const NOTIFICATION_QUERY_PREFIX = ['customer', 'notifications']

export const notificationListQueryKey = (customerId, page = 1, perPage = 10) => [
  ...NOTIFICATION_QUERY_PREFIX,
  'list',
  customerId,
  page,
  perPage,
]

export const notificationCustomerQueryKey = (customerId) => [
  ...NOTIFICATION_QUERY_PREFIX,
  'list',
  customerId,
]
