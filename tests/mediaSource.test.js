import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeVideoSource } from '../src/utils/mediaSource.js';

test('normalizes an R2 mp4 URL to native video markup', () => {
  const source = normalizeVideoSource('https://pub.example.r2.dev/videos/2026/07/lesson.mp4');

  assert.match(source, /^<video/);
  assert.match(source, /src="https:\/\/pub\.example\.r2\.dev\/videos\/2026\/07\/lesson\.mp4"/);
});

test('keeps trusted backend iframe/video markup unchanged', () => {
  const markup = '<iframe src="https://player.vimeo.com/video/123"></iframe>';

  assert.equal(normalizeVideoSource(markup), markup);
});
