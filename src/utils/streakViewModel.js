const safeWeek = (summary = {}) => summary.week ?? {};
const safeStreak = (summary = {}) => summary.streak ?? {};

export const createStreakViewModel = (summary) => {
  const week = safeWeek(summary);
  const streak = safeStreak(summary);
  const target = Number(week.watch_target_seconds) || 1800;
  const watched = Math.max(0, Number(week.watched_seconds) || 0);
  const qualified = Boolean(week.qualified);
  const started = Boolean(week.visit_completed) || watched > 0;
  const watchedMinutes = Math.min(30, Math.floor(watched / 60));
  const watchPercent = Math.min(100, Math.floor((watched / target) * 100));
  const heading = qualified
    ? 'Weekly goal completed'
    : started
      ? 'Keep your streak going'
      : 'Start a weekly streak';

  return {
    heading,
    watchedMinutes,
    watchPercent,
    visitText: week.visit_completed ? '1/1 visit' : '0/1 visit',
    visitCompleted: Boolean(week.visit_completed),
    watchCompleted: Boolean(week.watch_completed),
    currentStreak: Number(streak.current) || 0,
    longestStreak: Number(streak.longest) || 0,
    dateRange: week.start && week.end ? `${week.start} – ${week.end}` : '',
  };
};
