import test from 'node:test';
import assert from 'node:assert/strict';
import { getCourseProgressPercent } from '../src/utils/coursePlayer.js';

test('normalizes course progress for the player header ring', () => {
  assert.equal(getCourseProgressPercent({ progress_percent: 42.6 }), 43);
  assert.equal(getCourseProgressPercent({ progress_percent: 120 }), 100);
  assert.equal(getCourseProgressPercent({ progress_percent: -4 }), 0);
  assert.equal(getCourseProgressPercent({}), 0);
});
