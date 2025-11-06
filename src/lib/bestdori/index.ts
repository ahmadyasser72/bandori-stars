import * as asset from "./asset";
import { fetchBestdori } from "./client";

export const bestdori = <T>(pathname: string): Promise<T> =>
	fetchBestdori(pathname).then((response) => response.json());

bestdori.asset = asset;
