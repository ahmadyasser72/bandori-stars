// @ts-check
import icon from "astro-icon";
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

const SESSION_TTL = 7 * 24 * 60 * 60; /* 7 days */

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: cloudflare({ imageService: "passthrough" }),
	session: {
		cookie: { name: "laravel_session", maxAge: SESSION_TTL },
		ttl: SESSION_TTL,
	},
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
		css: { transformer: process.env.DEV ? "lightningcss" : "postcss" },
	},
	devToolbar: { enabled: false },
});
