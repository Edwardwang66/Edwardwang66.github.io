export function createRafClock(start = 0) {
  let now = start;
  let nextId = 1;
  const callbacks = new Map();
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;

  return {
    install() {
      window.requestAnimationFrame = (callback) => {
        const id = nextId++;
        callbacks.set(id, callback);
        return id;
      };
      window.cancelAnimationFrame = (id) => callbacks.delete(id);
    },
    advance(milliseconds) {
      now += milliseconds;
      const frame = [...callbacks.values()];
      callbacks.clear();
      frame.forEach((callback) => callback(now));
    },
    pending() {
      return callbacks.size;
    },
    restore() {
      callbacks.clear();
      window.requestAnimationFrame = originalRequestAnimationFrame;
      window.cancelAnimationFrame = originalCancelAnimationFrame;
    },
  };
}
