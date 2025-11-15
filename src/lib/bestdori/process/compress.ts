import { existsSync, readFileSync } from "node:fs";
import { join as joinPath } from "node:path";

import {
	BESTDORI_CACHE_DIR,
	IMAGE_FORMAT,
	MAX_IMAGE_WIDTH,
} from "~/lib/bestdori/constants";

export async function compressImage(name: string): Promise<Buffer | undefined>;
export async function compressImage(
	name: string,
	buffer: Buffer,
): Promise<Buffer>;
export async function compressImage(
	name: string,
	buffer?: Buffer,
): Promise<Buffer | undefined> {
	const path = getPath(name);
	if (buffer && !existsSync(path)) {
		const { default: sharp } = await import("sharp");
		await sharp(buffer)
			.resize({
				width: MAX_IMAGE_WIDTH,
				withoutEnlargement: true,
				kernel: "mks2021",
			})
			[IMAGE_FORMAT]({ quality: 67, effort: 4 })
			.toFile(path);
	}

	if (!buffer) return;
	return readFileSync(path);
}

const getPath = (name: string) =>
	joinPath(BESTDORI_CACHE_DIR, "compressed", `${name}.${IMAGE_FORMAT}`);
