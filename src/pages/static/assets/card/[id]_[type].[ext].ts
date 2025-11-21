import type {
	APIRoute,
	GetStaticPaths,
	InferGetStaticParamsType,
	InferGetStaticPropsType,
} from "astro";

import { shuffle } from "fast-shuffle";

import { card_map } from "@/contents/data";
import { bestdori } from "~/lib/bestdori";
import { hasNoPreTrained } from "~/lib/bestdori/asset";
import { AUDIO_FORMAT, IMAGE_FORMAT } from "~/lib/bestdori/constants";

export const prerender = true;

export const GET: APIRoute<Props, Params> = ({ props }) =>
	bestdori.asset.card(props).then((data) => new Response(data));

export const getStaticPaths = (() => {
	const allCards = [...card_map.values()];
	const kinds = ["icon", "full", "voiceline"] as const;

	const assets = allCards.flatMap((card) =>
		kinds.flatMap((kind) =>
			[true, false]
				// filter out pre-trained for card without it
				.filter((trained) => trained || !hasNoPreTrained(card))
				// filter out voiceline (trained) since there's only 1 voiceline anyway
				.filter((trained) => kind !== "voiceline" || !trained)
				.map((trained) => ({
					params: {
						id: card.id,
						type: trained ? `${kind}_trained` : kind,
						ext: kind === "voiceline" ? AUDIO_FORMAT : IMAGE_FORMAT,
					},
					props: { card, kind, trained },
				})),
		),
	);

	return shuffle(assets);
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;
