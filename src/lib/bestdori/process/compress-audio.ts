import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join as joinPath } from "node:path";

import { AUDIO_FORMAT, BESTDORI_CACHE_DIR } from "~/lib/bestdori/constants";

export async function compressAudio(name: string): Promise<Buffer | undefined>;
export async function compressAudio(
	name: string,
	buffer: Buffer,
): Promise<Buffer>;
export async function compressAudio(
	name: string,
	buffer?: Buffer,
): Promise<Buffer | undefined> {
	const path = getPath(name);
	if (buffer && !existsSync(path)) {
		const ffmpeg = spawnSync(
			"ffmpeg",
			[
				"-i",
				"pipe:0",
				"-c:a",
				"libopus",
				"-b:a",
				"64k",
				"-f",
				"opus",
				"pipe:1",
			],
			{ input: buffer },
		);

		if (ffmpeg.error || ffmpeg.status !== 0)
			throw new Error(`Error compressing audio for ${name}`, {
				cause: ffmpeg.stderr,
			});

		writeFileSync(path, ffmpeg.stdout);
	}

	if (!buffer) return;
	return readFileSync(path);
}

const getPath = (name: string) =>
	joinPath(BESTDORI_CACHE_DIR, "compressed-audio", `${name}.${AUDIO_FORMAT}`);
