import type { ContentData } from "@/scripts/generate-content";

// use scripts/generate-content.ts to generate data.js
export const {
	band_map,
	character_map,
	card_map,
	gacha_map,
	event_map,
	song_map,
}: ContentData;

type MapValue<T extends Map<any, any>> =
	T extends Map<any, infer Value> ? Value : never;

type Collections = keyof ContentData;
export type Entry<T extends Collections> = MapValue<ContentData[T]>;
