import * as devalue from "devalue";

import type { ContentData } from "@/scripts/generate-content";

import json from "./data.json?raw";

const data: ContentData = devalue.parse(json);
const { band_list, character_list, card_list, gacha_list, event_list } = data;

export { band_list, character_list, card_list, gacha_list, event_list };

type MapValue<T extends Map<any, any>> =
	T extends Map<any, infer K> ? K : never;

type Collections = keyof ContentData;
export type Entry<T extends Collections> = MapValue<ContentData[T]>;
