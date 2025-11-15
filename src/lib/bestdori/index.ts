import * as asset from "./asset";
import { fetchBestdori } from "./client";

export const bestdori = <T>(
	pathname: string,
	skipCache?: boolean | ((entry: T) => boolean),
): Promise<T> =>
	fetchBestdori(pathname, skipCache).then((response) => response.json());

bestdori.asset = asset;
