import { client, limit } from "./client";

export const bestdori = <T>(pathname: string) =>
	limit(() => client.get<T>(pathname).json());

export * as bestdoriAsset from "./asset";
