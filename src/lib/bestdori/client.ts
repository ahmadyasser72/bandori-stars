import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join as joinPath } from "node:path";

import ky from "ky";
import pLimit from "p-limit";

export const BESTDORI_CACHE_DIR = "./bestdori";
export const MAX_IMAGE_WIDTH = 1200;
export const IMAGE_FORMAT = "avif";

export const limit = pLimit(4);
const cachedResponses = new Set<string>();

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
				if (!cachedResponses.has(request.url) && response.ok) {
					const path = getCachePath(request);
					if (shouldPutCache(path, response)) {
						const buffer = await response.arrayBuffer().then(Buffer.from);
						writeFileSync(path, buffer);
					}
				}
			},
		],
		beforeRequest: [
			async (request) => {
				const path = getCachePath(request);
				if (existsSync(path) && !path.includes("all")) {
					cachedResponses.add(request.url);
					return new Response(readFileSync(path));
				}
			},
		],
	},
});

const getCachePath = (request: Request) => {
	const url = new URL(request.url);
	const filename = url.pathname.slice(1).replaceAll("/", "-");
	const path = joinPath(BESTDORI_CACHE_DIR, filename);

	return path;
};

const shouldPutCache = (file: string, response: Response) => {
	if (!existsSync(file)) return true;

	const fileSize = statSync(file).size.toString();
	const responseSize = response.headers.get("content-length");
	return fileSize !== responseSize;
};
