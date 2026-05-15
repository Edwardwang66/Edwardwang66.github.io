import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// For a user/organization site at <username>.github.io, base is "/".
// If you switch to a project repo (e.g. github.com/Edwardwang66/portfolio),
// change `base` to "/portfolio/".
export default defineConfig({
  plugins: [react()],
  base: "/",
});
