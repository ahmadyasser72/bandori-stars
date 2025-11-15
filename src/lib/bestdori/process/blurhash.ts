import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join as joinPath } from "node:path";

import { encode } from "blurhash";

import { BESTDORI_CACHE_DIR, BLURHASH_SIZE } from "~/lib/bestdori/constants";

export const generateBlurhash = async (name: string, buffer: Buffer) => {
	const path = getPath(name);
	if (!existsSync(path)) {
		const { default: sharp } = await import("sharp");

		const original = sharp(buffer);
		const metadata = await original.metadata();
		const [componentX, componentY] =
			metadata.height === metadata.width
				? [5, 5]
				: metadata.height > metadata.width
					? [4, 6]
					: [6, 4];

		const resized = await original
			.resize({ width: BLURHASH_SIZE, height: BLURHASH_SIZE })
			.raw()
			.ensureAlpha()
			.toBuffer();

		const hash = encode(
			new Uint8ClampedArray(resized),
			BLURHASH_SIZE,
			BLURHASH_SIZE,
			componentX,
			componentY,
		);
		writeFileSync(path, hash, { encoding: "utf-8" });
	}

	return readFileSync(path, "utf-8");
};

const getPath = (name: string) =>
	joinPath(BESTDORI_CACHE_DIR, "blurhash", `${name}.blurhash.txt`);
