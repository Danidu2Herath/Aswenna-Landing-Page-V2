import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/** Adds the Cloudflare Web Analytics beacon to built pages.
 *  Only when VITE_CF_BEACON_ID is set, and never in `vite dev`, so local
 *  work is not counted. The id is public by design. */
function cloudflareBeacon(id: string | undefined): Plugin {
  return {
    name: "cloudflare-web-analytics",
    apply: "build",
    transformIndexHtml() {
      if (!id) return;
      return [
        {
          tag: "script",
          attrs: {
            defer: true,
            src: "https://static.cloudflareinsights.com/beacon.min.js",
            "data-cf-beacon": JSON.stringify({ token: id }),
          },
          injectTo: "body",
        },
      ];
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    plugins: [react(), cloudflareBeacon(env.VITE_CF_BEACON_ID)],
    server: { port: 5173, host: true },
    build: {
      outDir: "dist",
      assetsInlineLimit: 2048,
      cssCodeSplit: false,
    },
  };
});
