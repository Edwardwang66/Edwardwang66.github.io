const POSITION_EPSILON = 0.001;
const VELOCITY_EPSILON = 0.01;

export function createDisclosureSpring(
  ids,
  initialActiveId,
  { responseSeconds = 0.4 } = {}
) {
  if (!(responseSeconds > 0)) {
    throw new RangeError("responseSeconds must be greater than zero");
  }

  const states = new Map(
    ids.map((id) => [
      id,
      {
        value: id === initialActiveId ? 1 : 0,
        velocity: 0,
        target: id === initialActiveId ? 1 : 0,
      },
    ])
  );

  function assertKnown(id) {
    if (!states.has(id)) {
      throw new RangeError(`Unknown disclosure ID: ${id}`);
    }
  }

  assertKnown(initialActiveId);

  return {
    retarget(nextActiveId) {
      assertKnown(nextActiveId);
      for (const [id, state] of states) {
        state.target = id === nextActiveId ? 1 : 0;
      }
    },

    jumpTo(nextActiveId) {
      assertKnown(nextActiveId);
      for (const [id, state] of states) {
        state.target = id === nextActiveId ? 1 : 0;
        state.value = state.target;
        state.velocity = 0;
      }
    },

    advance(deltaSeconds) {
      if (!Number.isFinite(deltaSeconds) || deltaSeconds < 0) {
        throw new RangeError("deltaSeconds must be a finite non-negative value");
      }
      if (deltaSeconds === 0) return;

      const omega = (2 * Math.PI) / responseSeconds;
      for (const state of states.values()) {
        const { value, velocity, target } = state;
        const displacement = value - target;
        const coefficient = velocity + omega * displacement;
        const decay = Math.exp(-omega * deltaSeconds);
        let nextValue =
          target + (displacement + coefficient * deltaSeconds) * decay;
        let nextVelocity =
          (velocity - omega * coefficient * deltaSeconds) * decay;

        if (
          (target === 1 && nextValue >= 1) ||
          (target === 0 && nextValue <= 0)
        ) {
          nextValue = target;
          nextVelocity = 0;
        }

        state.value = Math.max(0, Math.min(1, nextValue));
        state.velocity = nextVelocity;
      }
    },

    get(id) {
      assertKnown(id);
      return { ...states.get(id) };
    },

    isSettled() {
      return [...states.values()].every(
        ({ value, velocity, target }) =>
          Math.abs(value - target) < POSITION_EPSILON &&
          Math.abs(velocity) < VELOCITY_EPSILON
      );
    },
  };
}
