import test from 'node:test';
import assert from 'node:assert/strict';
import { learningStreakQueryKey, normalizeLearningStreak } from '../src/composables/streakQueryKeys.js';

test('uses one stable cache key for the current learner streak', () => {
  assert.deepEqual(learningStreakQueryKey(), ['learning-streak']);
});

test('normalizes an absent response into a safe streak shape', () => {
  const result = normalizeLearningStreak(null);

  assert.equal(result.week.watched_seconds, 0);
  assert.equal(result.streak.current, 0);
});
