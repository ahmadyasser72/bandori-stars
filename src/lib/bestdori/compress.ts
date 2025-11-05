import { existsSync, readFileSync } from "node:fs";
import { join as joinPath } from "node:path";

import { BESTDORI_CACHE_DIR, IMAGE_FORMAT, MAX_IMAGE_WIDTH } from "./client";

export const getCachedCompressedImage = (name: string) => {
	const path = getCompressedImagePath(name);
	if (existsSync(path)) return readFileSync(path);
};

export const compressImage = (name: string) => {
	const path = getCompressedImagePath(name);

	return async (response: Response) => {
		if (!existsSync(path)) {
			const { default: sharp } = await import("sharp");
			const buffer = await response.arrayBuffer();

			await sharp(buffer)
				.resize({
					width: MAX_IMAGE_WIDTH,
					withoutEnlargement: true,
					kernel: "mks2021",
				})
				[IMAGE_FORMAT]({ effort: 2 })
				.toFile(path);
		}

		return readFileSync(path);
	};
};

const getCompressedImagePath = (name: string) =>
	joinPath(BESTDORI_CACHE_DIR, "compressed", `${name}.${IMAGE_FORMAT}`);
