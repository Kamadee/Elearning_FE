import { onUnmounted, ref } from 'vue';
import useCourse from '@/composables/useCourse';
import { useCounterStore } from '@/stores/authStore';
import { prepareStreakFlush, collectPlaybackRange } from '@/utils/streakTracking';
import { streakOfflineQueue } from '@/services/streakOfflineQueue';

const createEventId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

export const useLearningStreakTracker = () => {
  const session = ref(null);
  const pendingRanges = ref([]);
  const syncing = ref(false);
  let baseline = null;
  let onlineHandler = null;

  const customerId = () => useCounterStore().getUser?.id;
  const resetBaseline = () => { baseline = null; };

  const flushQueued = async () => {
    const id = customerId();
    if (!id || syncing.value) return;
    syncing.value = true;
    try {
      return await streakOfflineQueue.flush(id, async (event) => useCourse().updateVideoProgress(event.payload));
    } finally {
      syncing.value = false;
    }
  };

  const start = async (courseId) => {
    await flushQueued();
    const result = await useCourse().startLearningStreakVisit(courseId);
    session.value = result?.tracking_session ?? null;
    if (!onlineHandler) {
      onlineHandler = () => { flushQueued().catch(() => {}); };
      window.addEventListener('online', onlineHandler);
    }
    return session.value;
  };

  const observe = (currentTime, isPlaying, playbackRate = 1) => {
    const now = Date.now();
    const next = { time: Number(currentTime), wallTime: now };
    if (!baseline) {
      baseline = next;
      return;
    }
    const range = collectPlaybackRange({
      previousTime: baseline.time,
      currentTime: next.time,
      previousWallTime: baseline.wallTime,
      currentWallTime: next.wallTime,
      playbackRate,
      isPlaying,
    });
    baseline = next;
    if (range) pendingRanges.value.push([range.start, range.end]);
  };

  const pause = () => resetBaseline();
  const visibilityChanged = () => {
    // Playback remains eligible while the Course Player is mounted, even in a background tab.
  };

  const flush = async ({ courseVideoId, watchedSeconds, totalSeconds, isCompleted = false }) => {
    const prepared = prepareStreakFlush(pendingRanges.value, session.value?.id);
    if (!prepared.canFlush || !customerId()) return null;

    const ranges = prepared.ranges;
    pendingRanges.value = prepared.remainingRanges;

    const payload = {
      course_video_id: courseVideoId,
      watched_seconds: watchedSeconds,
      total_seconds: totalSeconds,
      is_completed: isCompleted,
      tracking_session_id: session.value.id,
      event_id: createEventId(),
      captured_at: new Date().toISOString(),
      watched_ranges: ranges.map(([start, end]) => ({ start, end })),
      weekly_ranges: ranges.map(([start, end]) => ({ start, end })),
    };
    await streakOfflineQueue.enqueue({ event_id: payload.event_id, customer_id: customerId(), captured_at: payload.captured_at, payload });
    try {
      const response = await flushQueued();
      return { payload, response };
    } catch {
      return { payload, response: null };
    }
  };

  const dispose = () => {
    if (onlineHandler) window.removeEventListener('online', onlineHandler);
    onlineHandler = null;
    resetBaseline();
  };

  onUnmounted(dispose);

  return { session, syncing, start, observe, pause, visibilityChanged, flush, resetBaseline, flushQueued, dispose };
};
