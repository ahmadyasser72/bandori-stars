import type { APIRoute } from "astro";

import { shuffle } from "fast-shuffle";

import { bestdori } from "~/lib/bestdori";
import * as card from "./card/[id]_[type].[ext]";
import * as event from "./event/[id]_[type].[ext]";
import * as gacha from "./gacha/[id]_banner.[ext]";
import * as song from "./song/[id]_album_cover.[ext]";

export const prerender = true;

export const GET: APIRoute = async () => {
	const entries = await Promise.all(
		shuffle([
			...card
				.getStaticPaths()
				.map(
					async ({ params, props }) =>
						[
							`/static/assets/card/${params.id}_${params.type}.${params.ext}`,
							await bestdori.asset.card({ ...props, blurhash: true }),
						] as const,
				),
			...event
				.getStaticPaths()
				.map(
					async ({ params, props }) =>
						[
							`/static/assets/event/${params.id}_${params.type}.${params.ext}`,
							await bestdori.asset.event({ ...props, blurhash: true }),
						] as const,
				),
			...gacha
				.getStaticPaths()
				.map(
					async ({ params, props }) =>
						[
							`/static/assets/gacha/${params.id}_banner.${params.ext}`,
							await bestdori.asset.gachaBanner({ ...props, blurhash: true }),
						] as const,
				),
			...song
				.getStaticPaths()
				.map(
					async ({ params, props }) =>
						[
							`/static/assets/song/${params.id}_album_cover.${params.ext}`,
							await bestdori.asset.songAlbumCover({ ...props, blurhash: true }),
						] as const,
				),
		]),
	);

	const { compare } = new Intl.Collator(undefined, {
		numeric: true,
		sensitivity: "base",
	});
	return new Response(
		JSON.stringify(
			Object.fromEntries(
				entries.filter(([, hash]) => !!hash).sort(([a], [b]) => compare(a, b)),
			),
		),
	);
};
