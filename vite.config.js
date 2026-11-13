import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  ...(process.env.FIDEORA_REVIEW === "1" || process.env.VERCEL_ENV === "preview"
    ? {
        build: {
          rollupOptions: {
            input: { app: "index.html", review: "mappa-review.html" },
          },
        },
      }
    : {}),
});
