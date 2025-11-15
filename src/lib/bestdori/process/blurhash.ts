import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join as joinPath } from "node:path";

import { encode } from "blurhash";

import { BESTDORI_CACHE_DIR, BLURHASH_SIZE } from "~/lib/bestdori/constants";

export async function generateBlurhash(
	name: string,
): Promise<string | undefined>;
export async function generateBlurhash(
	name: string,
	buffer: Buffer,
): Promise<string>;
export async function generateBlurhash(
	name: string,
	buffer?: Buffer,
): Promise<string | undefined> {
	const path = getPath(name);
	if (buffer && !existsSync(path)) {
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

	if (!buffer) return;
	return readFileSync(path, "utf-8");
}

const getPath = (name: string) =>
	joinPath(BESTDORI_CACHE_DIR, "blurhash", `${name}.blurhash.txt`);
