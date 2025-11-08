import type { APIContext } from "astro";
import type { JSX } from "astro/jsx-runtime";

import { BLURHASH_FORMAT, IMAGE_FORMAT } from "~/lib/bestdori/constants";
import type { bestdori } from "./bestdori";
import { hasNoPreTrained } from "./bestdori/asset";

export const getBlurhash = async (context: APIContext, imageUrl: string) => {
	const fetch = import.meta.env.PROD
		? context.locals.runtime.env.ASSETS.fetch
		: globalThis.fetch;

	return fetch(
		new URL(imageUrl.replace(IMAGE_FORMAT, BLURHASH_FORMAT), context.url),
	).then((response) => response.text());
};

const defaultImageProps = {
	loading: "lazy",
	decoding: "async",
} satisfies JSX.ImgHTMLAttributes;

export const getCardAsset = (({ card, kind, trained }) => {
	trained ||= hasNoPreTrained(card);

	const parts = [card.id, kind];
	if (trained) parts.push("trained");

	const filename = parts.join("_");
	return {
		...defaultImageProps,
		src: `/static/assets/card/${filename}.${IMAGE_FORMAT}`,
		alt: trained
			? `Trained ${card.character.name} - ${card.name}`
			: `${card.character.name} - ${card.name}`,
	};
}) satisfies (
	arg: Pick<
		Parameters<typeof bestdori.asset.card>[0],
		"card" | "kind" | "trained"
	>,
) => Record<"src" | "alt", string> & JSX.ImgHTMLAttributes;

export const getGachaBanner = ((data) => ({
	...defaultImageProps,
	src: `/static/assets/gacha/${data.id}_banner.${IMAGE_FORMAT}`,
	alt: `Banner of ${data.name}`,
})) satisfies (
	...args: Parameters<typeof bestdori.asset.gachaBanner>
) => Record<"src" | "alt", string> & JSX.ImgHTMLAttributes;
