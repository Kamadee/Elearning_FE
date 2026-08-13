import test from 'node:test';
import assert from 'node:assert/strict';
import { collectPlaybackRange, compactRanges, prepareStreakFlush } from '../src/utils/streakTracking.js';

test('collects visible continuous playback into a timeline range', () => {
  const result = collectPlaybackRange({
    previousTime: 10,
    currentTime: 30,
    previousWallTime: 1_000,
    currentWallTime: 11_000,
    playbackRate: 2,
    isPlaying: true,
    isVisible: true,
  });

  assert.deepEqual(result, { start: 10, end: 30 });
});

test('collects continuous playback while the course player tab is in the background', () => {
  const result = collectPlaybackRange({
    previousTime: 16,
    currentTime: 26,
    previousWallTime: 1_000,
    currentWallTime: 11_000,
    playbackRate: 1,
    isPlaying: true,
    isVisible: false,
  });

  assert.deepEqual(result, { start: 16, end: 26 });
});

test('does not collect a seek jump', () => {
  const result = collectPlaybackRange({
    previousTime: 10,
    currentTime: 300,
    previousWallTime: 1_000,
    currentWallTime: 11_000,
    playbackRate: 1,
    isPlaying: true,
    isVisible: true,
  });

  assert.equal(result, null);
});

test('compacts adjacent and overlapping ranges before sync', () => {
  assert.deepEqual(compactRanges([[0, 10], [10, 20], [30, 40], [35, 50]]), [[0, 20], [30, 50]]);
});

test('keeps ranges pending when a tracking session is unavailable', () => {
  const pendingRanges = [[0, 8], [8, 12]];

  const result = prepareStreakFlush(pendingRanges, null);

  assert.equal(result.canFlush, false);
  assert.deepEqual(result.ranges, [[0, 12]]);
  assert.deepEqual(result.remainingRanges, pendingRanges);
});
