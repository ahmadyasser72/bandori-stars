import { existsSync, readFileSync } from "fs";
import { join as joinPath } from "node:path";

import sharp from "sharp";

import { BESTDORI_CACHE_DIR, IMAGE_FORMAT, MAX_IMAGE_WIDTH } from "./client";

export const compressImage = (name: string) => {
	const path = joinPath(
		BESTDORI_CACHE_DIR,
		"compressed",
		`${name}.${IMAGE_FORMAT}`,
	);

	return async (response: Response) => {
		if (!existsSync(path)) {
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
