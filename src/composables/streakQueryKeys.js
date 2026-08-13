export const learningStreakQueryKey = () => ['learning-streak'];

export const normalizeLearningStreak = (summary) => {
  const source = summary ?? {};
  return {
    week: {
      start: source.week?.start ?? null,
      end: source.week?.end ?? null,
      visit_completed: Boolean(source.week?.visit_completed),
      watched_seconds: Number(source.week?.watched_seconds) || 0,
      watch_target_seconds: Number(source.week?.watch_target_seconds) || 1800,
      watch_completed: Boolean(source.week?.watch_completed),
      qualified: Boolean(source.week?.qualified),
    },
    streak: {
      current: Number(source.streak?.current) || 0,
      longest: Number(source.streak?.longest) || 0,
      last_qualified_week: source.streak?.last_qualified_week ?? null,
    },
  };
};
