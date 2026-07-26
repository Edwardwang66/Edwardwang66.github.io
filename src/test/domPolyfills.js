if (!("AnimationEvent" in window)) {
  Object.defineProperty(window, "AnimationEvent", {
    configurable: true,
    value: window.Event,
  });
}
