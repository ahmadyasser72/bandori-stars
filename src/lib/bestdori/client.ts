import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join as joinPath } from "node:path";

import ky from "ky";
import pLimit from "p-limit";
import sharp from "sharp";

const BESTDORI_CACHE_DIR = "./bestdori";
const MAX_IMAGE_WIDTH = 1200;
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
					await mkdir(BESTDORI_CACHE_DIR).catch(() => {});

					const path = getCachePath(request);
					if (
						!shouldPutCache(path.file, response) ||
						!shouldPutCache(path.image, response)
					)
						return;

					const buffer = await response.arrayBuffer();
					const contentType = response.headers.get("content-type");

					if (contentType && contentType.startsWith("image/")) {
						const image = (await sharp(buffer)
							.resize({
								width: MAX_IMAGE_WIDTH,
								withoutEnlargement: true,
								kernel: "mks2021",
							})
							.toFormat(IMAGE_FORMAT)
							.toBuffer()) as Buffer<ArrayBuffer>;

						writeFileSync(path.image, image);
						return new Response(image, {
							headers: {
								"content-type": `image/${IMAGE_FORMAT}`,
								"content-length": image.byteLength.toString(),
							},
						});
					} else {
						writeFileSync(path.file, Buffer.from(buffer));
					}
				}
			},
		],
		beforeRequest: [
			async (request) => {
				await mkdir(BESTDORI_CACHE_DIR).catch(() => {});

				const path = getCachePath(request);
				if (existsSync(path.file) && !path.file.includes("all")) {
					cachedResponses.add(request.url);
					return new Response(readFileSync(path.file));
				} else if (existsSync(path.image)) {
					cachedResponses.add(request.url);
					return new Response(readFileSync(path.image));
				}
			},
		],
	},
});

const getCachePath = (request: Request) => {
	const url = new URL(request.url);
	const filename = url.pathname.slice(1).replaceAll("/", "-");
	const path = joinPath(BESTDORI_CACHE_DIR, filename);

	return { file: path, image: `${path}.${IMAGE_FORMAT}` };
};

const shouldPutCache = (file: string, response: Response) => {
	if (!existsSync(file)) return true;

	const fileSize = statSync(file).size.toString();
	const responseSize = response.headers.get("content-length");
	return fileSize !== responseSize;
};
