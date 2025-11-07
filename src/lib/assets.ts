import type { JSX } from "astro/jsx-runtime";

import { IMAGE_FORMAT } from "~/lib/bestdori/client";
import type { bestdori } from "./bestdori";
import { hasNoPreTrained } from "./bestdori/asset";

const defaultImageProps = {
	loading: "lazy",
	decoding: "async",
} satisfies JSX.ImgHTMLAttributes;

export const getCardAsset = ((kind, trained, data) => {
	trained ||= hasNoPreTrained(data);

	const parts = [data.id, kind];
	if (trained) parts.push("trained");

	const filename = parts.join("_");
	return {
		...defaultImageProps,
		src: `/static/assets/card/${filename}.${IMAGE_FORMAT}`,
		alt: trained
			? `Trained ${data.character.name} - ${data.name}`
			: `${data.character.name} - ${data.name}`,
	};
}) satisfies (
	...args: Parameters<typeof bestdori.asset.card>
) => Record<"src" | "alt", string> & JSX.ImgHTMLAttributes;

export const getGachaBanner = ((data) => ({
	...defaultImageProps,
	src: `/static/assets/gacha/${data.id}_banner.${IMAGE_FORMAT}`,
	alt: `Banner of ${data.name}`,
})) satisfies (
	...args: Parameters<typeof bestdori.asset.gachaBanner>
) => Record<"src" | "alt", string> & JSX.ImgHTMLAttributes;
