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

const eventMap = await timed("fetch event_map", loader.event().then(toMap));

const gachaMap = await timed(
	"fetch gacha_map",
	(async () => {
		const getGachaEvent = (
			region: "en" | "jp",
			{ startAt, endAt }: Pick<Schema<"gacha">, "startAt" | "endAt">,
		) => {
			const gacha = { startAt: startAt[region], endAt: endAt[region] };
			const events = [...eventMap.values()].map(({ id, startAt, endAt }) => ({
				id,
				startAt: startAt[region],
				endAt: endAt[region],
			}));

			const results = events
				.filter(
					(event) =>
						event.startAt &&
						event.endAt &&
						gacha.startAt &&
						gacha.endAt &&
						(gacha.startAt.isSame(event.startAt) ||
							gacha.startAt.isBetween(event.startAt, event.endAt) ||
							gacha.endAt.isBetween(event.startAt, event.endAt)),
				)
				.map(({ id }) => id);

			return results.length > 0 ? results : null;
		};

		return loader
			.gacha()
			.then((entries) =>
				entries.map((entry) => ({
					...entry,
					event: {
						jp: getGachaEvent("jp", entry),
						en: getGachaEvent("en", entry),
					},
				})),
			)
			.then(toMap);
	})(),
);

const cardMap = await timed(
	"fetch card_map",
	(async () => {
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
				.map(({ id }) => id);

			return filtered.length === 0 ? null : filtered;
		};

		return loader
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
			.then(toMap);
	})(),
);

const data = {
	band_map: bandMap,
	character_map: characterMap,
	card_map: cardMap,
	event_map: eventMap,
	gacha_map: gachaMap,
};
await timed(
	`save data [${Object.entries(data)
		.map(([key, map]) => `${key} (${[...map.keys()].length})`)
		.join(", ")}]`,
	save(data),
);

console.timeEnd("everything");

export type ContentData = typeof data;
