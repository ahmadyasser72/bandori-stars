import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, getEntry } from "astro:content";

import {
	collections,
	createCollectionIsDefined,
	toJsonResponse,
	type CollectionId,
} from "~/lib/collection";

export const prerender = true;

export const GET: APIRoute = async ({ params }) => {
	if (params.name !== "card") {
		const entry = await getEntry(params.name as CollectionId, params.id!)!;
		return toJsonResponse(entry.data);
	}

	const {
		data: { gacha, ...card },
	} = await getEntry(params.name, params.id!)!;

	const isGachaDefined = await createCollectionIsDefined("gacha");
	const resolveCardRateUp = (region: keyof typeof gacha) =>
		gacha[region] !== null
			? Promise.all(
					gacha[region].map(async (gachaId) => {
						if (!isGachaDefined(gachaId)) return null;

						const { id, type, startAt, endAt, rateUp } = (
							await getEntry("gacha", gachaId)!
						).data;
						const isRateUp = rateUp[region]!.some(
							({ cardId }) => cardId === card.id,
						);

						return isRateUp
							? { gachaId: id, gachaType: type, startAt, endAt }
							: null;
					}),
				).then((results) =>
					results.filter((data) => data !== null).map((data) => data!),
				)
			: null;

	return toJsonResponse({
		...card,
		rateUp: {
			jp: await resolveCardRateUp("jp"),
			en: await resolveCardRateUp("en"),
		},
	});
};

export const getStaticPaths: GetStaticPaths = () =>
	Promise.all(
		collections.map((name) =>
			getCollection(name).then((values) =>
				values.map(({ data }) => ({ params: { name: name, id: data.id } })),
			),
		),
	).then((it) => it.flat());
