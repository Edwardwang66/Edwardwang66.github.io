export function chooseActiveProject({
  ids,
  activeId,
  centersById,
  readingLine,
  direction,
  hysteresisPx = 64,
}) {
  if (!ids.length) return undefined;

  const candidates = ids
    .map((id, index) => ({ id, index, center: centersById.get(id) }))
    .filter(({ center }) => Number.isFinite(center))
    .map((candidate) => ({
      ...candidate,
      distance: Math.abs(candidate.center - readingLine),
    }));

  if (!candidates.length) {
    return ids.includes(activeId) ? activeId : ids[0];
  }

  const nearestDistance = Math.min(
    ...candidates.map((candidate) => candidate.distance)
  );
  const nearest = candidates.filter(
    (candidate) => candidate.distance === nearestDistance
  );
  const candidate =
    direction > 0
      ? nearest[nearest.length - 1]
      : nearest[0];

  const current = candidates.find(({ id }) => id === activeId);
  if (!current) return candidate.id;
  if (candidate.id === activeId) return activeId;

  return current.distance - candidate.distance >= hysteresisPx
    ? candidate.id
    : activeId;
}

export function isTapLockActive(
  lock,
  { now, scrollY, durationMs = 900, releaseDistancePx = 96 }
) {
  if (!lock) return false;
  const withinTime = now - lock.startedAt < durationMs;
  const withinDistance = Math.abs(scrollY - lock.scrollY) <= releaseDistancePx;
  return withinTime && withinDistance;
}
