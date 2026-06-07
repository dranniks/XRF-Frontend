import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isTauriMode = mode === "tauri";

  const publicBase = env.VITE_PUBLIC_BASE || "/";
  const proxyTargetApi = env.VITE_PROXY_TARGET_API || "";
  const devHttps = env.VITE_DEV_HTTPS === "true";
  const reactPlugins = react();
  const sslPlugins = devHttps ? [basicSsl()] : [];
  const pwaPlugins = isTauriMode
    ? []
    : [
        VitePWA({
          registerType: "autoUpdate",
          includeAssets: ["media/pwa-192.png", "media/pwa-512.png"],
          manifest: {
            name: "XRF Services Guest App",
            short_name: "XRF Guest",
            description: "Reference alloy services for XRF analysis.",
            start_url: publicBase,
            scope: publicBase,
            display: "standalone",
            background_color: "#000000",
            theme_color: "#000000",
            icons: [
              {
                src: "media/pwa-192.png",
                sizes: "192x192",
                type: "image/png"
              },
              {
                src: "media/pwa-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any maskable"
              }
            ]
          },
          devOptions: {
            enabled: true
          },
          workbox: {
            maximumFileSizeToCacheInBytes: 25 * 1024 * 1024
          }
        })
      ];

  return {
    base: publicBase,
    plugins: [
      ...(Array.isArray(reactPlugins) ? reactPlugins : [reactPlugins]),
      ...pwaPlugins,
      ...sslPlugins
    ],
    server: {
      host: true,
      https: devHttps
        ? ({
            allowHTTP1: true,
            minVersion: "TLSv1.2"
          } as any)
        : undefined,
      proxy:
        proxyTargetApi.length > 0
          ? {
              "/api": {
                target: proxyTargetApi,
                changeOrigin: true
              },
              "/xrf-media": {
                target: proxyTargetApi,
                changeOrigin: true
              }
            }
          : undefined
    },
    preview: {
      host: true
    }
  };
});
