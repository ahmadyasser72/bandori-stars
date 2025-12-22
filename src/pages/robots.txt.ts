import type { APIRoute } from "astro";

export const GET: APIRoute = ({ url }) =>
	new Response(
		[
			"User-agent: *",
			"Allow: /",
			"",
			`Sitemap: ${new URL("/sitemap.txt", url.origin)}`,
		].join("\n"),
		{
			headers: { "content-type": "text/plain" },
		},
	);
