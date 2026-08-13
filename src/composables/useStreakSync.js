import { computed, onMounted, onUnmounted, ref } from 'vue';
import { streakOfflineQueue } from '@/services/streakOfflineQueue';
import { useCounterStore } from '@/stores/authStore';

export const useStreakSync = () => {
  const pendingCount = ref(0);
  const customerId = computed(() => useCounterStore().getUser?.id);
  const refreshPendingCount = async () => {
    pendingCount.value = customerId.value ? (await streakOfflineQueue.pendingFor(customerId.value)).length : 0;
  };

  const handleQueueChange = () => { refreshPendingCount(); };
  onMounted(() => window.addEventListener('learning-streak-queue-change', handleQueueChange));
  onUnmounted(() => window.removeEventListener('learning-streak-queue-change', handleQueueChange));

  return { pendingCount, refreshPendingCount };
};
