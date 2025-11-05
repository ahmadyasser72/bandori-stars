// @ts-check
import icon from "astro-icon";
import { defineConfig } from "astro/config";

import netlify from "@astrojs/netlify";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: netlify(),
	session: { cookie: "laravel_session", ttl: 24 * 60 * 60 /* 1 day */ },
	integrations: [icon()],

	build: { concurrency: 4 },
	vite: {
		plugins: [tailwindcss()],
		server: { hmr: false },

		build: {
			rollupOptions: {
				output: {
					entryFileNames: "js/[hash:10].js",
					chunkFileNames: "js/chunks/[hash:10].js",
					assetFileNames: "assets/[hash:10][extname]",
				},
			},
		},
	},
	devToolbar: { enabled: false },
});
