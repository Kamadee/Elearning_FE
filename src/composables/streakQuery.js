import { useQuery } from '@tanstack/vue-query';
import useCourse from '@/composables/useCourse';
import { queryClient } from '@/plugins/queryClient';
import { learningStreakQueryKey, normalizeLearningStreak } from './streakQueryKeys';

export { learningStreakQueryKey, normalizeLearningStreak } from './streakQueryKeys';

export const setLearningStreak = (summary) => queryClient.setQueryData(
  learningStreakQueryKey(),
  normalizeLearningStreak(summary),
);

export const clearLearningStreak = () => queryClient.removeQueries({ queryKey: learningStreakQueryKey() });

export const useLearningStreakQuery = () => useQuery({
  queryKey: learningStreakQueryKey(),
  queryFn: async () => normalizeLearningStreak(await useCourse().getLearningStreak()),
  staleTime: 0,
  refetchOnMount: 'always',
  refetchOnWindowFocus: false,
  refetchInterval: false,
});
