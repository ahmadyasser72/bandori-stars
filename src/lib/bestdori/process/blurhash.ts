import { existsSync, readFileSync } from "node:fs";
import { join as joinPath } from "node:path";

import { decode, encode } from "blurhash";

import {
	BESTDORI_CACHE_DIR,
	BLURHASH_IMAGE_FORMAT,
} from "~/lib/bestdori/constants";
import { resizeOptions } from "./shared";

export const getBlurhashImage = async (name: string, buffer: Buffer) => {
	const path = getPath(name);
	if (!existsSync(path)) {
		const { default: sharp } = await import("sharp");

		const image = await sharp(buffer)
			.resize({ ...resizeOptions, width: 32 })
			.raw()
			.ensureAlpha()
			.toBuffer({ resolveWithObject: true });
		const hash = encode(
			new Uint8ClampedArray(image.data),
			image.info.width,
			image.info.height,
			2,
			2,
		);

		const blurhashImage = decode(hash, image.info.width, image.info.height);
		await sharp(blurhashImage, { raw: image.info }).webp().toFile(path);
	}

	return readFileSync(path);
};

const getPath = (name: string) =>
	joinPath(BESTDORI_CACHE_DIR, "blurhash", `${name}.${BLURHASH_IMAGE_FORMAT}`);
