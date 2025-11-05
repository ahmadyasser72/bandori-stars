import type { Entry } from "@/contents/data";

import { fetchBestdori } from "./client";
import { compressImage } from "./compress";

const hasNoPreTrained = ({ name, type }: Entry<"card_map">) =>
	name.en === "Graduation" || ["kirafes", "birthday"].includes(type);

export const card = async (
	kind: "icon" | "full",
	trained: boolean,
	data: Entry<"card_map">,
) => {
	const type = trained || hasNoPreTrained(data) ? "after_training" : "normal";
	const compress = compressImage(["card", data.id, kind, type].join("_"));

	switch (kind) {
		case "icon": {
			const chunkId = Math.floor(Number(data.id) / 50)
				.toString()
				.padStart(5, "0");

			const url = `assets/jp/thumb/chara/card${chunkId}_rip/${data.resourceId}_${type}.png`;
			return fetchBestdori(url)
				.catch(() => fetchBestdori(url.replace("jp", "en")))
				.then(compress);
		}

		case "full": {
			const url = `assets/jp/characters/resourceset/${data.resourceId}_rip/card_${type}.png`;
			return fetchBestdori(url)
				.catch(() => fetchBestdori(url.replace("jp", "en")))
				.then(compress);
		}
	}
};

export const gachaBanner = async (data: Entry<"gacha_map">) =>
	fetchBestdori(
		`assets/jp/homebanner_rip/${data.bannerAssetBundleName}.png`,
	).then(compressImage(`gacha_${data.id}_banner`));
