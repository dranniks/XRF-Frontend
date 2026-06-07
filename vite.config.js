var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), "");
    var isTauriMode = mode === "tauri";
    var publicBase = env.VITE_PUBLIC_BASE || "/";
    var proxyTargetApi = env.VITE_PROXY_TARGET_API || "";
    var devHttps = env.VITE_DEV_HTTPS === "true";
    var reactPlugins = react();
    var sslPlugins = devHttps ? [basicSsl()] : [];
    var pwaPlugins = isTauriMode
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
        plugins: __spreadArray(__spreadArray(__spreadArray([], (Array.isArray(reactPlugins) ? reactPlugins : [reactPlugins]), true), pwaPlugins, true), sslPlugins, true),
        server: {
            host: true,
            https: devHttps
                ? {
                    allowHTTP1: true,
                    minVersion: "TLSv1.2"
                }
                : undefined,
            proxy: proxyTargetApi.length > 0
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
