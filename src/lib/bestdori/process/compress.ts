import { existsSync, readFileSync } from "node:fs";
import { join as joinPath } from "node:path";

import { BESTDORI_CACHE_DIR, IMAGE_FORMAT } from "~/lib/bestdori/constants";
import { resizeOptions } from "./shared";

export const compressImage = async (name: string, buffer: Buffer) => {
	const path = getPath(name);
	if (!existsSync(path)) {
		const { default: sharp } = await import("sharp");
		await sharp(buffer)
			.resize(resizeOptions)
			[IMAGE_FORMAT]({ quality: 67, effort: 2 })
			.toFile(path);
	}

	return readFileSync(path);
};

const getPath = (name: string) =>
	joinPath(BESTDORI_CACHE_DIR, "compressed", `${name}.${IMAGE_FORMAT}`);
