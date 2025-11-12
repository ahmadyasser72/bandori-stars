import { bestdori } from "~/lib/bestdori";
import { dayjs, now } from "~/lib/date";
import * as Bandori from "~/lib/schema";
import { parser, schema } from ".";

export const band = async () => {
	const bands = await bestdori<Bandori.Bands>("api/bands/main.1.json");

	const entries = Object.entries(bands).map(([id, { bandName }]) => ({
		id,
		name: parser.regionTuple(bandName),
	}));

	return entries.map((entry) => schema.band.parse(entry));
};

export const character = async () => {
	const characters = await bestdori<Bandori.Characters>(
		"api/characters/main.3.json",
	);

	const entries = Object.entries(characters).map(
		([id, { characterName, bandId, nickname }]) => {
			const nick = parser.regionTuple(nickname);

			return {
				id,
				band: bandId.toString(),
				name: Object.values(nick).every((it) => it === null)
					? parser.regionTuple(characterName)
					: nick,
			};
		},
	);

	return entries.map((entry) => schema.character.parse(entry));
};

export const card = async () => {
	const cardList = await bestdori<Bandori.CardList>(
		"api/cards/all.5.json",
		true,
	);

	const gacha = ["permanent", "limited", "dreamfes", "birthday", "kirafes"];
	const entries = await Promise.all(
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

	return entries
		.filter(({ name }) => name.jp !== null)
		.map((entry) => schema.card.parse(entry));
};

export const event = async () => {
	const eventList = await bestdori<Bandori.EventList>(
		"api/events/all.5.json",
		true,
	);

	const entries = await Promise.all(
		Object.entries(eventList)
			.filter(([, { startAt, endAt }]) =>
				maybeWillBeAvailableOnEn(startAt, endAt),
			)
			.map(async ([id], idx) => {
				const bandoriEvent = await bestdori<Bandori.Event>(
					`api/events/${id}.json`,
					idx < 10,
				);

				const {
					eventType,
					eventName,
					attributes,
					characters,
					startAt,
					endAt,
					assetBundleName,
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
					assetBundleName,
					pointRewards: parser.event.pointRewards(pointRewards),
					rankingRewards: parser.event.rankingRewards(rankingRewards),
					storyRewards: parser.event.storyRewards(stories),
				};
			}),
	);

	return entries
		.filter(({ name }) => name.jp !== null)
		.map((entry) => schema.event.parse(entry));
};

export const gacha = async () => {
	const gachaList = await bestdori<Bandori.GachaList>(
		"api/gacha/all.5.json",
		true,
	);

	const f2p = ["permanent", "limited", "dreamfes", "birthday", "kirafes"];
	const entries = await Promise.all(
		Object.entries(gachaList)
			.filter(
				([_, { type, publishedAt, closedAt }]) =>
					f2p.includes(type) && maybeWillBeAvailableOnEn(publishedAt, closedAt),
			)
			.map(async ([id], idx) => {
				const gacha = await bestdori<Bandori.Gacha>(
					`api/gacha/${id}.json`,
					idx < 10,
				);

				const {
					gachaName,
					type,
					publishedAt,
					closedAt,
					details,
					rates,
					bannerAssetBundleName,
				} = gacha;

				return {
					id,
					name: parser.regionTuple(gachaName),
					type,
					startAt: parser.timestamp(publishedAt),
					endAt: parser.timestamp(closedAt),
					rateUp: parser.gacha.rateUp(details, rates),
					bannerAssetBundleName,
				};
			}),
	);

	return entries
		.filter(({ name }) => name.jp !== null)
		.map((entry) => schema.gacha.parse(entry));
};

export const song = async () => {
	const songList = await bestdori<Bandori.SongList>(
		"api/songs/all.5.json",
		true,
	);

	const entries = await Promise.all(
		Object.entries(songList)
			.filter(
				([, { publishedAt, difficulty }]) =>
					maybeWillBeAvailableOnEn(publishedAt) ||
					(difficulty[4]?.publishedAt &&
						maybeWillBeAvailableOnEn(difficulty[4].publishedAt)),
			)
			.map(async ([id, entry], idx) => {
				const song = await bestdori<Bandori.Song>(
					`api/songs/${id}.json`,
					idx < 10 || entry.difficulty[4]?.publishedAt !== undefined,
				);

				const { musicTitle, publishedAt, achievements, difficulty } = song;
				const special = difficulty[4];

				return {
					id: id,
					title: parser.regionTuple(musicTitle),
					releasedAt: parser.timestamp(publishedAt),
					specialReleasedAt:
						special === undefined
							? undefined
							: parser.timestamp(special.publishedAt ?? publishedAt),
					rewards: parser.song.rewards(achievements, difficulty),
				};
			}),
	);

	return entries
		.filter(({ releasedAt }) => releasedAt.jp !== null)
		.map((entry) => schema.song.parse(entry));
};

const maybeWillBeAvailableOnEn = (
	from: Bandori.RegionTuple<string>,
	to?: Bandori.RegionTuple<string>,
) => {
	const [jpStart, enStart] = from.map((n) => n !== null && dayjs(Number(n)));
	const [jpEnd, enEnd] = (to ?? from).map(
		(n) => n !== null && dayjs(Number(n)),
	);

	const isFarTooLongSinceJpRelease =
		// it probably won't be released ever on EN
		// if it still wasn't released after 15 months since JP release
		jpStart && jpEnd && !enStart && now().isAfter(jpEnd.add(15, "months"));

	const soonToBeOnEn = !enStart || enStart.isAfter(dayjs());
	const currentlyOnEn = enStart && enEnd && now().isBetween(enStart, enEnd);

	return !isFarTooLongSinceJpRelease && (soonToBeOnEn || currentlyOnEn);
};
