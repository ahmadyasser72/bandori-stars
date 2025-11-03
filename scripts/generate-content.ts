import { loader } from "~/lib/content";
import type { Schema } from "~/lib/content/schema";
import { regionValue } from "~/lib/utilities";
import { save, timed, toMap } from "./helpers";

console.time("everything");

const bandList = await timed("get band-list", loader.band().then(toMap));
const characterList = await timed(
	"get character-list",
	loader.character().then(toMap),
);

const gachaList = await timed("get gacha-list", loader.gacha().then(toMap));
const getCardRateUp = (
	region: "en" | "jp",
	card: Pick<Schema<"card">, "id" | "gacha">,
) => {
	const items = card.gacha[region];
	if (!items) return null;

	const filtered = items
		.filter((id) => gachaList.has(id))
		.map((id) => gachaList.get(id)!)
		.filter(({ rateUp }) =>
			rateUp[region]!.some((rateUp) => rateUp.card === card.id),
		)
		.map(({ id, startAt, endAt }) => ({ id, startAt, endAt }));

	return filtered.length === 0 ? null : filtered;
};

const cardList = await timed(
	"get card-list",
	loader
		.card()
		.then((entries) =>
			entries.map(({ character: characterId, ...entry }) => {
				const character = characterList.get(characterId)!;
				const band = bandList.get(character.band)!;

				return {
					band: { id: band.id, name: regionValue.unwrap(band.name) },
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

const eventList = await timed("get event-list", loader.event().then(toMap));

const data = {
	band_list: bandList,
	character_list: characterList,
	card_list: cardList,
	event_list: eventList,
	gacha_list: gachaList,
};
await timed("save data", save("data", data));

console.timeEnd("everything");

export type ContentData = typeof data;
