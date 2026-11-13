import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  ...(process.env.FIDEORA_REVIEW === "1"
    ? {
        build: {
          rollupOptions: {
            input: { app: "index.html", review: "mappa-review.html" },
          },
        },
      }
    : {}),
});
