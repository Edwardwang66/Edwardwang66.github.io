import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  base: "/",
  test: {
    environment: "jsdom",
    environmentOptions: { jsdom: { pretendToBeVisual: true } },
    setupFiles: "./src/test/setup.js",
    css: true,
    globals: true,
    exclude: [...configDefaults.exclude, "e2e/**", ".worktrees/**"],
  },
});
