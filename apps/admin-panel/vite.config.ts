import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: "../../",
  server: {
    port: Number(process.env.ADMIN_PANEL_PORT) || 3001,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@repo/ui": path.resolve(__dirname, "../../packages/ui/src/index.ts"),
      "@repo/types": path.resolve(__dirname, "../../packages/types/src/index.ts"),
      "@repo/schema": path.resolve(__dirname, "../../packages/schema/src/index.ts"),
      "@repo/i18n": path.resolve(__dirname, "../../packages/i18n/src/index.ts"),
      "@repo/mantine": path.resolve(__dirname, "../../packages/mantine/src/index.ts"),
      "@repo/shared": path.resolve(__dirname, "../../packages/shared/src/index.ts"),
      "@repo/store": path.resolve(__dirname, "../../packages/store/src/index.ts"),
      "@repo/services": path.resolve(__dirname, "../../packages/services/src/index.ts"),
    },
    dedupe: ['react', 'react-dom', '@mantine/core', '@mantine/hooks', '@mantine/modals', '@mantine/notifications'],
  },
});
