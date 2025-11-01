import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";

import ky from "ky";
import pLimit from "p-limit";

const BESTDORI_CACHE_DIR = "./bestdori";

export const limit = pLimit(4);

export const client = ky.create({
	prefixUrl: "https://bestdori.com",
	retry: {
		limit: Number.POSITIVE_INFINITY,
		retryOnTimeout: true,
		jitter: true,
	},
	hooks: {
		afterResponse: [
			async (request, _options, response) => {
				if (response.ok) {
					await mkdir(BESTDORI_CACHE_DIR).catch(() => {});

					const file = getCachePath(request);
					if (!existsSync(file)) {
						const data = await response.arrayBuffer();

						writeFileSync(file, Buffer.from(data));
					}
				}
			},
		],
		beforeRequest: [
			async (request) => {
				await mkdir(BESTDORI_CACHE_DIR).catch(() => {});

				const file = getCachePath(request);
				if (existsSync(file) && !file.includes("all")) {
					const data = readFileSync(file);
					return new Response(data);
				}
			},
		],
	},
});

const getCachePath = (request: Request) => {
	const url = new URL(request.url);
	const filename = url.pathname.slice(1).replaceAll("/", "-");

	return path.join(BESTDORI_CACHE_DIR, filename);
};
