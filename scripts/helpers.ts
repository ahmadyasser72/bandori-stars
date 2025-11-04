import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import * as devalue from "devalue";

export const toMap = <T extends { id: string } & object>(
	array: T[],
): Map<string, T> =>
	new Map(array.map((data) => [data.id, data] as [string, T]));

const BASE_CONTENT_PATH = path.resolve(__dirname, "../.contents/");
export const save = async (data: any) => {
	await mkdir(BASE_CONTENT_PATH).catch(() => {});

	const content = devalue.stringify(data);
	await writeFile(path.join(BASE_CONTENT_PATH, "data.json"), content);
};

export const timed = async <T>(
	label: string,
	promise: Promise<T>,
): Promise<T> => {
	console.time(label);
	const results = await promise;
	console.timeEnd(label);
	return results;
};
