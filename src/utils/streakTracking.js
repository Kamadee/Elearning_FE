const TOLERANCE_SECONDS = 3;

export const compactRanges = (ranges = []) => {
  const sorted = ranges
    .map((range) => [Math.floor(Number(range[0] ?? range.start)), Math.floor(Number(range[1] ?? range.end))])
    .filter(([start, end]) => Number.isFinite(start) && Number.isFinite(end) && start >= 0 && end > start)
    .sort((a, b) => a[0] - b[0]);

  return sorted.reduce((merged, [start, end]) => {
    const previous = merged.at(-1);
    if (previous && start <= previous[1]) {
      previous[1] = Math.max(previous[1], end);
    } else {
      merged.push([start, end]);
    }
    return merged;
  }, []);
};

export const prepareStreakFlush = (pendingRanges = [], trackingSessionId = null) => {
  const ranges = compactRanges(pendingRanges);
  const canFlush = Boolean(trackingSessionId && ranges.length > 0);

  return {
    ranges,
    canFlush,
    remainingRanges: canFlush ? [] : pendingRanges,
  };
};

export const collectPlaybackRange = ({
  previousTime,
  currentTime,
  previousWallTime,
  currentWallTime,
  playbackRate = 1,
  isPlaying,
}) => {
  if (!isPlaying || !Number.isFinite(previousTime) || !Number.isFinite(currentTime)) return null;

  const contentDelta = currentTime - previousTime;
  const wallDelta = Math.max(0, (currentWallTime - previousWallTime) / 1000);
  const maximumPlausibleDelta = (wallDelta * Math.max(1, playbackRate)) + TOLERANCE_SECONDS;
  if (contentDelta <= 0 || contentDelta > maximumPlausibleDelta) return null;

  return { start: Math.floor(previousTime), end: Math.ceil(currentTime) };
};
