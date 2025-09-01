// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/icon", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  eslint: {
    config: {
      standalone: false,
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      allowedHosts: [".ngrok-free.app", ".share.zrok.io"],
    },
  },
  devServer: {
    port: 8443,
    // https: {
    //   key: "./server.key",
    //   cert: "./server.pem",
    // },
  },
  nitro: {
    routeRules: {
      "/**": {
        headers: {
          "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
        },
      },
    },
  },
});
