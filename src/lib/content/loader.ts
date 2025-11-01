import { bestdori } from "~/lib/bestdori";
import * as Bandori from "~/lib/schema";
import { parser } from ".";

export const band = async () => {
	const bands = await bestdori<Bandori.Bands>("api/bands/main.1.json");

	return Promise.all(
		Object.entries(bands).map(([id, { bandName }]) => ({
			id,
			name: parser.regionTuple(bandName),
		})),
	);
};

export const character = async () => {
	const characters = await bestdori<Bandori.Characters>(
		"api/characters/main.3.json",
	);

	return Promise.all(
		Object.entries(characters).map(([id, { characterName, bandId }]) => ({
			id,
			band: bandId.toString(),
			name: parser.regionTuple(characterName),
		})),
	);
};

export const card = async () => {
	const cardList = await bestdori<Bandori.CardList>("api/cards/all.5.json");

	const gacha = ["permanent", "limited", "dreamfes", "birthday", "kirafes"];
	const results = await Promise.all(
		Object.entries(cardList)
			.filter(
				([, { rarity, type }]) => Number(rarity) >= 4 && gacha.includes(type),
			)
			.map(async ([id]) => {
				const card = await bestdori<Bandori.Card>(`api/cards/${id}.json`);

				const {
					characterId,
					rarity,
					attribute,
					resourceSetName,
					type,
					prefix,
					releasedAt,
					source,
				} = card;

				return {
					id,
					resourceId: resourceSetName,
					character: characterId.toString(),
					rarity,
					name: parser.regionTuple(prefix),
					type,
					attribute,
					releasedAt: parser.timestamp(releasedAt),
					gacha: parser.card.gacha(source),
				};
			}),
	);

	return results.filter(({ name }) => name.jp !== null);
};

export const event = async () => {
	const eventList = await bestdori<Bandori.EventList>("api/events/all.5.json");

	const results = await Promise.all(
		Object.entries(eventList)
			.filter(([, { startAt }]) => isUpcomingOnEn(startAt))
			.map(async ([id]) => {
				const bandoriEvent = await bestdori<Bandori.Event>(
					`api/events/${id}.json`,
				);

				const {
					eventType,
					eventName,
					attributes,
					characters,
					startAt,
					endAt,
					pointRewards,
					rankingRewards,
					stories,
				} = bandoriEvent;

				return {
					id: id,
					name: parser.regionTuple(eventName),
					type: eventType,
					attribute: attributes[0].attribute,
					characters: characters.map(({ characterId }) =>
						characterId.toString(),
					),
					startAt: parser.timestamp(startAt),
					endAt: parser.timestamp(endAt),
					pointRewards: parser.event.pointRewards(pointRewards),
					rankingRewards: parser.event.rankingRewards(rankingRewards),
					storyRewards: parser.event.storyRewards(stories),
				};
			}),
	);

	return results.filter(({ name }) => name.jp !== null);
};

export const gacha = async () => {
	const gachaList = await bestdori<Bandori.GachaList>("api/gacha/all.5.json");

	const f2p = ["permanent", "limited", "dreamfes", "birthday", "kirafes"];
	const results = await Promise.all(
		Object.entries(gachaList)
			.filter(
				([_, { type, publishedAt }]) =>
					f2p.includes(type) && isUpcomingOnEn(publishedAt),
			)
			.map(async ([id]) => {
				const gacha = await bestdori<Bandori.Gacha>(`api/gacha/${id}.json`);

				const { gachaName, type, publishedAt, closedAt, details, rates } =
					gacha;

				return {
					id,
					name: parser.regionTuple(gachaName),
					type,
					startAt: parser.timestamp(publishedAt),
					endAt: parser.timestamp(closedAt),
					rateUp: parser.gacha.rateUp(details, rates),
				};
			}),
	);

	return results.filter(({ name }) => name.jp !== null);
};

const isUpcomingOnEn = ([jp, en]: Bandori.RegionTuple<string>) =>
	jp && (en === null || new Date(Number(en)) > new Date());
