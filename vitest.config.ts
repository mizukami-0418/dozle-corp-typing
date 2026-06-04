import { defineConfig } from "vitest/config";
import type { PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // Vite 8 と Vitest 3 内包 Vite 7 の Plugin 型不一致を型キャストで回避
  plugins: [tsconfigPaths(), react() as unknown as PluginOption],
  test: {
    environment: "jsdom",
    globals: false,
  },
});
