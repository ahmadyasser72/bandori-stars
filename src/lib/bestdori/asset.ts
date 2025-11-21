import type { Entry } from "@/contents/data";
import { fetchBestdori } from "./client";
import { generateBlurhash } from "./process/blurhash";
import { compressAudio } from "./process/compress-audio";
import { compressImage } from "./process/compress-image";

export const hasNoPreTrained = ({ name, type }: Entry<"card_map">) =>
	name === "Graduation" || ["kirafes", "birthday"].includes(type);

type AssetBuffer = Promise<Buffer<ArrayBuffer>>;
type AssetBlurhash = Promise<string>;
type Blurhashable<T extends boolean = boolean> = { blurhash?: T };

interface AssetCardParameters {
	card: Entry<"card_map">;
	kind: "icon" | "full" | "voiceline";
	trained: boolean;
}

export async function card(
	options: AssetCardParameters & Blurhashable<false>,
): AssetBuffer;
export async function card(
	options: AssetCardParameters & Blurhashable<true>,
): AssetBlurhash;
export async function card({
	card,
	kind,
	trained,
	blurhash = false,
}: AssetCardParameters & Blurhashable) {
	const type = trained ? "after_training" : "normal";
	const name = (
		kind === "voiceline"
			? ["card", card.id, kind]
			: ["card", card.id, kind, type]
	).join("_");

	const postProcess =
		kind === "voiceline"
			? compressAudio
			: blurhash
				? generateBlurhash
				: compressImage;

	const cached = await postProcess(name);
	if (cached) return cached;

	let buffer: Buffer;
	switch (kind) {
		case "icon": {
			const chunkId = Math.floor(Number(card.id) / 50)
				.toString()
				.padStart(5, "0");

			buffer = await fetchBestdoriWithRegionFallbacks(
				`assets/jp/thumb/chara/card${chunkId}_rip/${card.resourceId}_${type}.png`,
			);
			break;
		}

		case "full": {
			buffer = await fetchBestdoriWithRegionFallbacks(
				`assets/jp/characters/resourceset/${card.resourceId}_rip/card_${type}.png`,
			);
			break;
		}

		case "voiceline": {
			const resourceName = (() => {
				const id = Number(card.id);
				if (id < 1353 || id >= 5000) return "spin";

				switch (card.type) {
					case "permanent":
						return "operationspin";
					case "birthday":
						return "birthdayspin";
					default:
						return "limitedspin";
				}
			})();

			buffer = await fetchBestdoriWithRegionFallbacks(
				`https://bestdori.com/assets/jp/sound/voice/gacha/${resourceName}_rip/${card.resourceId}.mp3`,
			);
			break;
		}
	}

	return postProcess(name, buffer);
}

interface AssetEventParameters {
	event: Entry<"event_map">;
	kind: "banner" | "background";
}

export async function event(
	options: AssetEventParameters & Blurhashable<false>,
): AssetBuffer;
export async function event(
	options: AssetEventParameters & Blurhashable<true>,
): AssetBlurhash;
export async function event({
	event,
	kind,
	blurhash = false,
}: AssetEventParameters & Blurhashable) {
	const name = ["event", event.id, kind].join("_");
	const postProcess = blurhash ? generateBlurhash : compressImage;
	const cached = await postProcess(name);
	if (cached) return cached;

	let buffer: Buffer;
	switch (kind) {
		case "banner": {
			buffer = await fetchBestdoriWithRegionFallbacks(
				`assets/jp/event/${event.assetBundleName}/images_rip/banner.png`,
			);
			break;
		}

		case "background": {
			buffer = await fetchBestdoriWithRegionFallbacks(
				`assets/jp/event/${event.assetBundleName}/topscreen_rip/bg_eventtop.png`,
			);
			break;
		}
	}

	return postProcess(name, buffer);
}

interface AssetGachaBannerParameters {
	gacha: Entry<"gacha_map">;
}

export async function gachaBanner(
	options: AssetGachaBannerParameters & Blurhashable<false>,
): AssetBuffer;
export async function gachaBanner(
	options: AssetGachaBannerParameters & Blurhashable<true>,
): AssetBlurhash;
export async function gachaBanner({
	gacha,
	blurhash = false,
}: AssetGachaBannerParameters & Blurhashable) {
	const name = `gacha_${gacha.id}_banner`;
	const postProcess = blurhash ? generateBlurhash : compressImage;
	const cached = await postProcess(name);
	if (cached) return cached;

	const buffer = await fetchBestdoriWithRegionFallbacks(
		`assets/jp/homebanner_rip/${gacha.bannerAssetBundleName}.png`,
	);

	return postProcess(name, buffer);
}

interface AssetSongAlbumCoverParameters {
	song: Entry<"song_map">;
}

export async function songAlbumCover(
	options: AssetSongAlbumCoverParameters & Blurhashable<false>,
): AssetBuffer;
export async function songAlbumCover(
	options: AssetSongAlbumCoverParameters & Blurhashable<true>,
): AssetBlurhash;
export async function songAlbumCover({
	song,
	blurhash = false,
}: AssetSongAlbumCoverParameters & Blurhashable) {
	const name = `song_${song.id}_album_cover`;
	const postProcess = blurhash ? generateBlurhash : compressImage;
	const cached = await postProcess(name);
	if (cached) return cached;

	const chunk = 10 * Math.ceil(Number(song.id) / 10);
	const buffer = await fetchBestdoriWithRegionFallbacks(
		`assets/jp/musicjacket/musicjacket${chunk}_rip/assets-star-forassetbundle-startapp-musicjacket-musicjacket${chunk}-${song.jacketImage[0].toLowerCase()}-jacket.png`,
	);

	return postProcess(name, buffer);
}

const fetchBestdoriWithRegionFallbacks = (jpUrl: string) =>
	fetchBestdori(jpUrl)
		.catch(() => fetchBestdori(jpUrl.replace("jp", "en")))
		.catch(() => fetchBestdori(jpUrl.replace("jp", "cn")))
		.catch(() => fetchBestdori(jpUrl.replace("jp", "tw")))
		.then((response) => response.arrayBuffer())
		.then(Buffer.from);
