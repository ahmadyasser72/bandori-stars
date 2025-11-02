// @ts-check
import icon from "astro-icon";
import { defineConfig } from "astro/config";

import netlify from "@astrojs/netlify";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: netlify(),
	integrations: [icon()],
	build: { concurrency: 4 },

	vite: {
		plugins: [tailwindcss()],
		server: { hmr: false },
	},
	devToolbar: { enabled: false },
});
