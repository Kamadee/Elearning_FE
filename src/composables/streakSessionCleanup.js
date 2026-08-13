import { queryClient } from '@/plugins/queryClient';
import { learningStreakQueryKey } from '@/composables/streakQueryKeys';
import { streakOfflineQueue } from '@/services/streakOfflineQueue';

export const clearCustomerStreakState = async (customerId) => {
  queryClient.removeQueries({ queryKey: learningStreakQueryKey() });
  if (customerId) await streakOfflineQueue.clearCustomer(customerId);
};
