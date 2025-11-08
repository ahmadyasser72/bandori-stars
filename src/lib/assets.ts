import type { JSX } from "astro/jsx-runtime";

import { IMAGE_FORMAT } from "~/lib/bestdori/constants";
import type { bestdori } from "./bestdori";
import { hasNoPreTrained } from "./bestdori/asset";

const defaultImageProps = {
	loading: "lazy",
	decoding: "async",
} satisfies JSX.ImgHTMLAttributes;

export const getCardAsset = (({ card, kind, trained, blurhash }) => {
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
		"data-blurhash": blurhash,
	};
}) satisfies (
	arg: Pick<
		Parameters<typeof bestdori.asset.card>[0],
		"card" | "kind" | "trained"
	> & { blurhash?: boolean },
) => Record<"src" | "alt", string> & JSX.ImgHTMLAttributes;

export const getGachaBanner = ((data) => ({
	...defaultImageProps,
	src: `/static/assets/gacha/${data.id}_banner.${IMAGE_FORMAT}`,
	alt: `Banner of ${data.name}`,
})) satisfies (
	...args: Parameters<typeof bestdori.asset.gachaBanner>
) => Record<"src" | "alt", string> & JSX.ImgHTMLAttributes;
