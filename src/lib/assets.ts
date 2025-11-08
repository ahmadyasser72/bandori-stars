import type { APIContext } from "astro";
import type { JSX } from "astro/jsx-runtime";

import { IMAGE_FORMAT } from "~/lib/bestdori/constants";
import type { bestdori } from "./bestdori";
import { hasNoPreTrained } from "./bestdori/asset";

export const getBlurhash = async (context: APIContext, pathname: string) => {
	if (import.meta.env.DEV) return "UZOf75~pJC%M?Gs*pJt7yEW=xvNH?INGRjWY";

	return context.locals.runtime.env.ASSETS.fetch(
		new URL("/static/assets/blurhash.json", context.url),
	)
		.then((response) => response.json<any>())
		.then((json) => json[pathname] as string);
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

export const getGachaBanner = (({ gacha }) => ({
	...defaultImageProps,
	src: `/static/assets/gacha/${gacha.id}_banner.${IMAGE_FORMAT}`,
	alt: `Banner of ${gacha.name}`,
})) satisfies (
	arg: Pick<Parameters<typeof bestdori.asset.gachaBanner>[0], "gacha">,
) => Record<"src" | "alt", string> & JSX.ImgHTMLAttributes;
