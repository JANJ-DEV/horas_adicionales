import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup/vitest.setup.ts"],
    globals: false,
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
  },
});
