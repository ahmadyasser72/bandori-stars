import { fetchBestdori } from "./client";

export const bestdori = <T>(pathname: string): Promise<T> =>
	fetchBestdori(pathname).then((response) => response.json());

export * as bestdoriAsset from "./asset";
