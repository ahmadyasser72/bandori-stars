import type {
	APIRoute,
	GetStaticPaths,
	InferGetStaticParamsType,
	InferGetStaticPropsType,
} from "astro";

import { favicons } from "favicons";

import { card_map } from "@/contents/data";
import { bestdori } from "~/lib/bestdori";
import { hasNoPreTrained } from "~/lib/bestdori/asset";

export const prerender = true;

export const GET: APIRoute<Props, Params> = async ({ props }) => {
	return new Response(Buffer.from(props.buffer));
};

export const getStaticPaths = (async () => {
	const ayaCards = [...card_map.values()].filter(
		({ character, rarity }) => character.id === "16" && rarity === 5,
	);

	const randomAyaCard = ayaCards[Math.floor(Math.random() * ayaCards.length)];
	const buffer = await bestdori.asset.card({
		card: randomAyaCard,
		kind: "icon",
		trained: hasNoPreTrained(randomAyaCard) ? true : Math.random() < 0.5,
	});

	const response = await favicons(buffer, {
		icons: {
			android: false,
			appleIcon: false,
			appleStartup: false,
			favicons: true,
			windows: false,
			yandex: false,
		},
	});

	return response.images.map(({ name, contents: buffer }) => ({
		params: { ext: name.slice(7) },
		props: { buffer },
	}));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;
