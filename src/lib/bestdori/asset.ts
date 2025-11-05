import type { Entry } from "@/contents/data";

import { fetchBestdori } from "./client";
import { compressImage, getCachedCompressedImage } from "./compress";

const hasNoPreTrained = ({ name, type }: Entry<"card_map">) =>
	name.en === "Graduation" || ["kirafes", "birthday"].includes(type);

export const card = async (
	kind: "icon" | "full",
	trained: boolean,
	data: Entry<"card_map">,
) => {
	const type = trained || hasNoPreTrained(data) ? "after_training" : "normal";

	const filename = ["card", data.id, kind, type].join("_");
	const cached = getCachedCompressedImage(filename);
	if (cached !== undefined) return cached;

	const compress = compressImage(filename);
	switch (kind) {
		case "icon": {
			const chunkId = Math.floor(Number(data.id) / 50)
				.toString()
				.padStart(5, "0");

			return fetchBestdoriWithRegionFallbacks(
				`assets/jp/thumb/chara/card${chunkId}_rip/${data.resourceId}_${type}.png`,
			).then(compress);
		}

		case "full": {
			return fetchBestdoriWithRegionFallbacks(
				`assets/jp/characters/resourceset/${data.resourceId}_rip/card_${type}.png`,
			).then(compress);
		}
	}
};

export const gachaBanner = async (data: Entry<"gacha_map">) => {
	const filename = `gacha_${data.id}_banner`;
	const cached = getCachedCompressedImage(filename);
	if (cached !== undefined) return cached;

	const compress = compressImage(filename);
	fetchBestdoriWithRegionFallbacks(
		`assets/jp/homebanner_rip/${data.bannerAssetBundleName}.png`,
	).then(compress);
};

const fetchBestdoriWithRegionFallbacks = (jpUrl: string) =>
	fetchBestdori(jpUrl)
		.catch(() => fetchBestdori(jpUrl.replace("jp", "en")))
		.catch(() => fetchBestdori(jpUrl.replace("jp", "cn")))
		.catch(() => fetchBestdori(jpUrl.replace("jp", "tw")));
