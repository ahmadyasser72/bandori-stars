import { loader } from "~/lib/content";
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
	loader
		.gacha()
		.then((entries) =>
			entries.map((entry) => ({
				...entry,
				events: (() => {
					const get = (region: "en" | "jp") => {
						const { startAt, endAt } = entry;
						const gacha = { startAt: startAt[region], endAt: endAt[region] };
						const events = [...eventMap.values()].map(
							({ id, startAt, endAt }) => ({
								id,
								startAt: startAt[region],
								endAt: endAt[region],
							}),
						);

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
							.map(({ id }) => eventMap.get(id)!);

						return results.length > 0 ? results : null;
					};

					return { jp: get("jp"), en: get("en") };
				})(),
			})),
		)
		.then(regionValue.mapUnwrap("name"))
		.then(toMap),
);

const cardMap = await timed(
	"fetch card_map",
	loader
		.card()
		.then((entries) =>
			entries.map(({ character: characterId, gacha, ...entry }) => {
				const { band, ...character } = characterMap.get(characterId)!;

				return {
					band,
					character,
					...entry,
					rateUpGacha: regionValue.map(gacha, (items, region) =>
						items
							.filter((id) => gachaMap.has(id))
							.map((id) => gachaMap.get(id)!)
							.filter(({ rateUp }) =>
								rateUp[region]!.some((rateUp) => rateUp.card === entry.id),
							)
							.map(({ id }) => ({ id })),
					),
				};
			}),
		)
		.then(regionValue.mapUnwrap("name"))
		.then(toMap),
);

const gacha_map = toMap(
	[...gachaMap.values()].map(({ rateUp, ...entry }) => ({
		...entry,
		rateUp: regionValue.map(rateUp, (items) =>
			items.map(({ card, rate }) => ({ card: cardMap.get(card)!, rate })),
		),
	})),
);

const data = {
	band_map: bandMap,
	character_map: characterMap,
	event_map: eventMap,
	card_map: cardMap,
	gacha_map,
} satisfies Record<string, Map<string, any>>;

await timed(
	`save data [${Object.entries(data)
		.map(([key, map]) => `${key} (${[...map.keys()].length})`)
		.join(", ")}]`,
	save(data),
);

console.timeEnd("everything");

export type ContentData = typeof data;
