import { loader } from "~/lib/content";
import type { Schema } from "~/lib/content/schema";
import { regionValue } from "~/lib/utilities";
import { save, timed, toMap } from "./helpers";

console.time("everything");

const bandMap = await timed(
	"fetch band_map",
	loader.band().then(regionValue.mapUnwrap("name")).then(toMap),
);
const characterMap = await timed(
	"fetch character_map",
	loader
		.character()
		.then((entries) =>
			entries.map(({ band, ...entry }) => ({
				...entry,
				band: bandMap.get(band)!,
			})),
		)
		.then(regionValue.mapUnwrap("name"))
		.then(toMap),
);

const eventMap = await timed(
	"fetch event_map",
	loader
		.event()
		.then((entries) =>
			entries.map(({ characters, ...entry }) => ({
				...entry,
				characters: characters.map((character) => characterMap.get(character)!),
			})),
		)
		.then(regionValue.mapUnwrap("name", "pointRewards", "rankingRewards"))
		.then(toMap),
);

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
			.then(regionValue.mapUnwrap("name"))
			.then(toMap);
	})(),
);

const cardMap = await timed(
	"fetch card_map",
	(async () => {
		type Card = Schema<"card">;
		const getCardRateUp = (
			card: Card["id"],
			region: "en" | "jp",
			gacha: Card["gacha"],
		) => {
			const items = gacha[region];
			if (!items) return null;

			const filtered = items
				.filter((id) => gachaMap.has(id))
				.map((id) => gachaMap.get(id)!)
				.filter(({ rateUp }) =>
					rateUp[region]!.some((rateUp) => rateUp.card === card),
				)
				.map(({ id }) => id);

			return filtered.length > 0 ? filtered : null;
		};

		return loader
			.card()
			.then((entries) =>
				entries.map(({ character: characterId, gacha, ...entry }) => {
					const { band, ...character } = characterMap.get(characterId)!;

					return {
						band,
						character,
						rateUp: {
							jp: getCardRateUp(entry.id, "jp", gacha),
							en: getCardRateUp(entry.id, "en", gacha),
						},
						...entry,
					};
				}),
			)
			.then(regionValue.mapUnwrap("name"))
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
