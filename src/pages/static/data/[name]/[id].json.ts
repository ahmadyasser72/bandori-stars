import type {
	APIRoute,
	GetStaticPaths,
	InferGetStaticParamsType,
	InferGetStaticPropsType,
} from "astro";
import { getCollection, getEntry, type CollectionEntry } from "astro:content";

import {
	collections,
	createCollectionIsDefined,
	toJsonResponse,
} from "~/lib/collection";

export const prerender = true;

export const GET: APIRoute<Props, Params> = async ({ params, props }) => {
	if (params.name !== "card") return toJsonResponse(props.data);

	const { gacha, ...card } = props.data as CollectionEntry<"card">["data"];

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

export const getStaticPaths = (async () => {
	const collectionEntries = await Promise.all(
		collections.map((name) =>
			getCollection(name).then((entries) =>
				entries.map(({ id, data }) => ({
					params: { name, id },
					props: { data },
				})),
			),
		),
	);

	return collectionEntries.flat();
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;
