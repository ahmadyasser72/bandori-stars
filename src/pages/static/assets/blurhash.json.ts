import type { APIRoute } from "astro";

import { shuffle } from "fast-shuffle";

import { bestdori } from "~/lib/bestdori";
import * as card from "./card/[id]_[type].[ext]";
import * as event from "./event/[id]_banner.[ext]";
import * as gacha from "./gacha/[id]_banner.[ext]";

export const prerender = true;

export const GET: APIRoute = async () => {
	const assets = await Promise.all([
		...card
			.getStaticPaths()
			.map(async ({ params, props }) => [
				`/static/assets/card/${params.id}_${params.type}.${params.ext}`,
				await bestdori.asset.card({ ...props, blurhash: true }),
			]),
		...event
			.getStaticPaths()
			.map(async ({ params, props }) => [
				`/static/assets/event/${params.id}_banner.${params.ext}`,
				await bestdori.asset.eventBanner({ ...props, blurhash: true }),
			]),
		...gacha
			.getStaticPaths()
			.map(async ({ params, props }) => [
				`/static/assets/gacha/${params.id}_banner.${params.ext}`,
				await bestdori.asset.gachaBanner({ ...props, blurhash: true }),
			]),
	]).then(shuffle);

	return new Response(JSON.stringify(Object.fromEntries(assets)));
};
