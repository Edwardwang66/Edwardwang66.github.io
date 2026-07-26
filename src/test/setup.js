import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

const mediaState = new Map();
const mediaListeners = new Map();

export function setMediaQuery(query, matches) {
  mediaState.set(query, matches);
  for (const listener of mediaListeners.get(query) || []) {
    listener({ matches, media: query });
  }
}

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: vi.fn((query) => ({
    media: query,
    get matches() {
      return mediaState.get(query) ?? false;
    },
    onchange: null,
    addEventListener: (_type, listener) => {
      const listeners = mediaListeners.get(query) || new Set();
      listeners.add(listener);
      mediaListeners.set(query, listeners);
    },
    removeEventListener: (_type, listener) => {
      mediaListeners.get(query)?.delete(listener);
    },
    addListener: (listener) => {
      const listeners = mediaListeners.get(query) || new Set();
      listeners.add(listener);
      mediaListeners.set(query, listeners);
    },
    removeListener: (listener) => mediaListeners.get(query)?.delete(listener),
    dispatchEvent: () => true,
  })),
});

Object.defineProperty(window, "scrollTo", {
  configurable: true,
  value: vi.fn(),
});

afterEach(() => {
  cleanup();
  mediaState.clear();
  mediaListeners.clear();
  vi.clearAllMocks();
});
