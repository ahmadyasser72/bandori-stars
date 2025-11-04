import { loader } from "~/lib/content";
import type { Schema } from "~/lib/content/schema";
import { regionValue } from "~/lib/utilities";
import { save, timed, toMap } from "./helpers";

console.time("everything");

const bandMap = await timed("fetch band_map", loader.band().then(toMap));
const characterMap = await timed(
	"fetch character_map",
	loader
		.character()
		.then((entries) =>
			entries.map((character) => {
				const band = bandMap.get(character.band)!;

				return {
					...character,
					band: { id: band.id, name: regionValue.unwrap(band.name) },
				};
			}),
		)
		.then(toMap),
);

const gachaMap = await timed("fetch gacha_map", loader.gacha().then(toMap));
const getCardRateUp = (
	region: "en" | "jp",
	card: Pick<Schema<"card">, "id" | "gacha">,
) => {
	const items = card.gacha[region];
	if (!items) return null;

	const filtered = items
		.filter((id) => gachaMap.has(id))
		.map((id) => gachaMap.get(id)!)
		.filter(({ rateUp }) =>
			rateUp[region]!.some((rateUp) => rateUp.card === card.id),
		)
		.map(({ id, startAt, endAt }) => ({ id, startAt, endAt }));

	return filtered.length === 0 ? null : filtered;
};

const cardMap = await timed(
	"fetch card_map",
	loader
		.card()
		.then((entries) =>
			entries.map(({ character: characterId, ...entry }) => {
				const character = characterMap.get(characterId)!;

				return {
					band: character.band,
					character: {
						id: character.id,
						name: regionValue.unwrap(character.name),
					},
					rateUp: {
						jp: getCardRateUp("jp", entry),
						en: getCardRateUp("en", entry),
					},
					...entry,
				};
			}),
		)
		.then(toMap),
);

const eventMap = await timed("fetch event_map", loader.event().then(toMap));

const data = {
	band_map: bandMap,
	character_map: characterMap,
	card_map: cardMap,
	event_map: eventMap,
	gacha_map: gachaMap,
};
await timed(`save data [${Object.keys(data).join(", ")}]`, save(data));

console.timeEnd("everything");

export type ContentData = typeof data;
