import * as devalue from "devalue";

import type { ContentData } from "@/scripts/generate-content";

import { dayjs } from "~/lib/date";
import json from "./data.json?raw";

const data: ContentData = devalue.parse(json, {
	dayjs: (value) => dayjs.unix(value),
});
const { band_map, character_map, card_map, gacha_map, event_map } = data;
export { band_map, character_map, card_map, gacha_map, event_map };

type MapValue<T extends Map<any, any>> =
	T extends Map<any, infer Value> ? Value : never;

type Collections = keyof ContentData;
export type Entry<T extends Collections> = MapValue<ContentData[T]>;
