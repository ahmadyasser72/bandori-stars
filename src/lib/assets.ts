import type { APIContext } from "astro";
import type { JSX } from "astro/jsx-runtime";

import { IMAGE_FORMAT } from "~/lib/bestdori/constants";
import type { bestdori } from "./bestdori";
import { hasNoPreTrained } from "./bestdori/asset";

const blurhashMap = new Map<string, string>();
const getBlurhash = async (context: APIContext, pathname: string) => {
	// return hardcoded blurhash on development since blurhash.json
	// needs all asset images to be downlaoded
	if (import.meta.env.DEV) return "UZOf75~pJC%M?Gs*pJt7yEW=xvNH?INGRjWY";

	if (blurhashMap.size === 0) {
		const json = await context.locals.runtime.env.ASSETS.fetch(
			new URL("/static/assets/blurhash.json", context.url),
		).then((response) => response.json<Record<string, string>>());

		for (const [key, value] of Object.entries(json)) {
			blurhashMap.set(key, value);
		}
	}

	return blurhashMap.get(pathname)!;
};

const imageAttributes = {
	loading: "lazy",
	decoding: "async",
} satisfies JSX.ImgHTMLAttributes;

type BestdoriAsset = typeof bestdori.asset;
type GetAssetFunction<K extends keyof BestdoriAsset> = (
	context: APIContext,
	params: Omit<Parameters<BestdoriAsset[K]>[0], "blurhash">,
) => Promise<Record<"src" | "alt", string> & JSX.ImgHTMLAttributes>;

export const getCardAsset = (async (context, { card, kind, trained }) => {
	trained ||= hasNoPreTrained(card);

	const parts = [card.id, kind];
	if (trained) parts.push("trained");

	const filename = parts.join("_");
	const src = `/static/assets/card/${filename}.${IMAGE_FORMAT}`;

	return {
		...imageAttributes,
		src,
		alt: trained
			? `Trained ${card.character.name} - ${card.name}`
			: `${card.character.name} - ${card.name}`,
		"data-blurhash": await getBlurhash(context, src),
	};
}) satisfies GetAssetFunction<"card">;

export const getEventAsset = (async (context, { event, kind }) => {
	const filename = [event.id, kind].join("_");
	const src = `/static/assets/event/${filename}.${IMAGE_FORMAT}`;

	return {
		...imageAttributes,
		src,
		alt: `${event.name} ${kind}`,
		"data-blurhash": await getBlurhash(context, src),
	};
}) satisfies GetAssetFunction<"event">;

export const getGachaBanner = (async (context, { gacha }) => {
	const src = `/static/assets/gacha/${gacha.id}_banner.${IMAGE_FORMAT}`;

	return {
		...imageAttributes,
		src,
		alt: `Banner of ${gacha.name}`,
		"data-blurhash": await getBlurhash(context, src),
	};
}) satisfies GetAssetFunction<"gachaBanner">;
