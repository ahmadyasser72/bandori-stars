import type { APIRoute } from "astro";

export const GET: APIRoute = ({ url }) =>
	new Response(`Sitemap: ${new URL("/sitemap.txt", url.origin)}`, {
		headers: { "content-type": "text/plain" },
	});
