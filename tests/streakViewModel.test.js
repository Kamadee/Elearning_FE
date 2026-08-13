import test from 'node:test';
import assert from 'node:assert/strict';
import { createStreakViewModel } from '../src/utils/streakViewModel.js';

test('formats streak progress and the active heading', () => {
  const view = createStreakViewModel({
    week: { watched_seconds: 1259, watch_target_seconds: 1800, visit_completed: true, watch_completed: false, qualified: false, start: '2026-08-10', end: '2026-08-16' },
    streak: { current: 2, longest: 5 },
  });

  assert.equal(view.heading, 'Keep your streak going');
  assert.equal(view.watchedMinutes, 20);
  assert.equal(view.watchPercent, 69);
  assert.equal(view.visitText, '1/1 visit');
});

test('caps completed display at thirty minutes', () => {
  const view = createStreakViewModel({
    week: { watched_seconds: 2000, watch_target_seconds: 1800, visit_completed: true, watch_completed: true, qualified: true, start: '2026-08-10', end: '2026-08-16' },
    streak: { current: 3, longest: 5 },
  });

  assert.equal(view.heading, 'Weekly goal completed');
  assert.equal(view.watchedMinutes, 30);
  assert.equal(view.watchPercent, 100);
});
