import { existsSync, readFileSync, writeFileSync } from "fs";
import { join as joinPath } from "node:path";

import sharp from "sharp";

import { BESTDORI_CACHE_DIR, IMAGE_FORMAT, MAX_IMAGE_WIDTH } from "./client";

export const compressImage = (name: string) => {
	const path = joinPath(
		BESTDORI_CACHE_DIR,
		"compressed",
		`${name}.${IMAGE_FORMAT}`,
	);

	return async (buffer: ArrayBuffer) => {
		if (existsSync(path)) return readFileSync(path);

		const image = await sharp(buffer)
			.resize({
				width: MAX_IMAGE_WIDTH,
				withoutEnlargement: true,
				kernel: "mks2021",
			})
			.toFormat(IMAGE_FORMAT)
			.toBuffer();

		writeFileSync(path, image);
		return image as Buffer<ArrayBuffer>;
	};
};
