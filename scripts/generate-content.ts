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
			entries
				.map((entry) => ({
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

							const results = events.filter(
								(event) =>
									event.startAt &&
									event.endAt &&
									gacha.startAt &&
									gacha.endAt &&
									(gacha.endAt.isAfter(event.endAt) ||
										gacha.endAt.isBetween(event.startAt, event.endAt)),
							);

							if (results.length === 0) return null;

							const activeEventId = results.find(
								(event) =>
									gacha.startAt!.isSame(event.startAt) ||
									gacha.startAt!.isBetween(event.startAt, event.endAt),
							)?.id;

							return {
								past: results
									.filter((event) => event.endAt!.isBefore(gacha.startAt))
									.map(({ id }) => eventMap.get(id)!),
								active: activeEventId ? eventMap.get(activeEventId)! : null,
							};
						};

						return { jp: get("jp"), en: get("en") };
					})(),
				}))
				.filter(({ events }) => {
					const unwrapped = regionValue.unwrap(events);
					return (unwrapped?.past.length ?? 0) > 0 || !!unwrapped?.active;
				}),
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

const songMap = await timed(
	"fetch song_map",
	loader.song().then(regionValue.mapUnwrap("title")).then(toMap),
);

const LATEST_EVENT_RELEASE_GAP = await timed(
	"fetch latest event day gap",
	(async () => {
		const allEvents = await loader.event(true);
		const { startAt } = allEvents.filter(({ startAt }) => !!startAt.en).at(-1)!;
		return startAt.en!.diff(startAt.jp);
	})(),
);

const data = {
	band_map: bandMap,
	character_map: characterMap,
	event_map: eventMap,
	card_map: cardMap,
	song_map: songMap,
	gacha_map,
	LATEST_EVENT_RELEASE_GAP,
};

await timed(
	`save data [${Object.entries(data)
		.map(
			([key, value]) =>
				`${key} (${value instanceof Map ? [...value.keys()].length : 1})`,
		)
		.join(", ")}]`,
	save(data),
);

console.timeEnd("everything");

export type ContentData = typeof data;
