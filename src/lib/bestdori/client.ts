import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";

import ky from "ky";
import pLimit from "p-limit";
import sharp from "sharp";

const BESTDORI_CACHE_DIR = "./bestdori";
const CACHED_IMAGE_FORMAT = ".webp";
const MAX_IMAGE_HEIGHT = 600;

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
					await mkdir(BESTDORI_CACHE_DIR).catch(() => {});

					const file = getCachePath(request);
					const fileImage = file + CACHED_IMAGE_FORMAT;
					if (
						!shouldPutCache(file, response) ||
						!shouldPutCache(fileImage, response)
					)
						return;

					const buffer = await response.arrayBuffer();
					const contentType = response.headers.get("content-type");

					if (contentType && contentType.startsWith("image/")) {
						const image = sharp(buffer);
						const metadata = await image.metadata();
						if (metadata.height > MAX_IMAGE_HEIGHT)
							image.resize({ height: MAX_IMAGE_HEIGHT });

						const compressedImage = await image
							.webp({ quality: 50, preset: "drawing", effort: 6 })
							.toArray()
							.then(Buffer.from);
						writeFileSync(fileImage, compressedImage);

						return new Response(compressedImage, {
							headers: {
								"content-type": "image/webp",
								"content-length": compressedImage.byteLength.toString(),
							},
						});
					} else {
						writeFileSync(file, Buffer.from(buffer));
					}
				}
			},
		],
		beforeRequest: [
			async (request) => {
				await mkdir(BESTDORI_CACHE_DIR).catch(() => {});

				const file = getCachePath(request);
				const fileImage = file + CACHED_IMAGE_FORMAT;
				if (existsSync(file) && !file.includes("all")) {
					cachedResponses.add(request.url);
					return new Response(readFileSync(file));
				} else if (existsSync(fileImage)) {
					cachedResponses.add(request.url);
					return new Response(readFileSync(fileImage));
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

const shouldPutCache = (file: string, response: Response) => {
	if (!existsSync(file)) return true;

	const fileSize = statSync(file).size.toString();
	const responseSize = response.headers.get("content-length");
	return fileSize !== responseSize;
};
