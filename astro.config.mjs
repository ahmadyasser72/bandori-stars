// @ts-check
import icon from "astro-icon";
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	session: { cookie: "laravel_session", ttl: 24 * 60 * 60 /* 1 day */ },
	integrations: [icon()],

	build: { concurrency: 4 },
	vite: {
		plugins: [tailwindcss()],
		server: { hmr: false },
		ssr: { external: ["node:fs", "node:path", "sharp"] },

		build: {
			rollupOptions: {
				output: {
					entryFileNames: "js/[hash:10].js",
					chunkFileNames: "js/chunks/[hash:10].js",
				},
			},
		},
	},
	devToolbar: { enabled: false },
});
