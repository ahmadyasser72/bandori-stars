import { IMAGE_FORMAT } from "~/lib/bestdori/client";

export const getCardAssetUrl = (
	kind: "icon" | "full",
	trained: boolean,
	id: string,
) => {
	const parts = [id, kind];
	if (trained) parts.push("trained");

	const filename = parts.join("_");
	return `/static/assets/card/${filename}.${IMAGE_FORMAT}`;
};

export const getGachaBannerUrl = (id: string) =>
	`/static/assets/gacha/${id}_banner.${IMAGE_FORMAT}`;
