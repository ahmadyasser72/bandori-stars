import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join as joinPath } from "node:path";

import { encode } from "blurhash";

import { BESTDORI_CACHE_DIR, BLURHASH_SIZE } from "~/lib/bestdori/constants";
import { resizeOptions } from "./shared";

export const getBlurhashImage = async (name: string, buffer: Buffer) => {
	const path = getPath(name);
	if (!existsSync(path)) {
		const { default: sharp } = await import("sharp");

		const image = await sharp(buffer)
			.resize({ ...resizeOptions, width: BLURHASH_SIZE, height: BLURHASH_SIZE })
			.raw()
			.ensureAlpha()
			.toBuffer({ resolveWithObject: true });
		const hash = encode(
			new Uint8ClampedArray(image.data),
			BLURHASH_SIZE,
			BLURHASH_SIZE,
			4,
			4,
		);

		writeFileSync(path, hash);
	}

	return readFileSync(path, "utf-8");
};

const getPath = (name: string) =>
	joinPath(BESTDORI_CACHE_DIR, "blurhash", `${name}.blurhash.txt`);
