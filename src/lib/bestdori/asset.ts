import type { Entry } from "@/contents/data";
import { fetchBestdori } from "./client";
import { getBlurhashImage } from "./process/blurhash";
import { compressImage } from "./process/compress";

export const hasNoPreTrained = ({ name, type }: Entry<"card_map">) =>
	name === "Graduation" || ["kirafes", "birthday"].includes(type);

interface AssetCardParameters {
	card: Entry<"card_map">;
	kind: "icon" | "full";
	trained: boolean;
	blurhash?: boolean;
}

export const card = async ({
	card,
	kind,
	trained,
	blurhash = false,
}: AssetCardParameters) => {
	if (!trained && hasNoPreTrained(card)) return;

	const type = trained ? "after_training" : "normal";
	const name = ["card", card.id, kind, type].join("_");

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
	}

	return (blurhash ? getBlurhashImage : compressImage)(name, buffer);
};

interface AssetGachaBannerParameters {
	gacha: Entry<"gacha_map">;
	blurhash?: boolean;
}

export const gachaBanner = async ({
	gacha,
	blurhash = false,
}: AssetGachaBannerParameters) => {
	const name = `gacha_${gacha.id}_banner`;
	const buffer = await fetchBestdoriWithRegionFallbacks(
		`assets/jp/homebanner_rip/${gacha.bannerAssetBundleName}.png`,
	);

	return (blurhash ? getBlurhashImage : compressImage)(name, buffer);
};

const fetchBestdoriWithRegionFallbacks = (jpUrl: string) =>
	fetchBestdori(jpUrl)
		.catch(() => fetchBestdori(jpUrl.replace("jp", "en")))
		.catch(() => fetchBestdori(jpUrl.replace("jp", "cn")))
		.catch(() => fetchBestdori(jpUrl.replace("jp", "tw")))
		.then((response) => response.arrayBuffer())
		.then(Buffer.from);
