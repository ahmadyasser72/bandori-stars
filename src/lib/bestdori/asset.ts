import type { Entry } from "@/contents/data";

import { client, limit } from "./client";

const hasNoPreTrained = (type: string) =>
	["kirafes", "birthday"].includes(type);

export const card = async (
	kind: "icon" | "image",
	trained: boolean,
	{ id, ...data }: Entry<"card_list">,
) => {
	const type =
		trained || hasNoPreTrained(data.type) ? "after_training" : "normal";

	switch (kind) {
		case "icon": {
			const chunkId = Math.floor(Number(id) / 50)
				.toString()
				.padStart(5, "0");

			return limit(() =>
				client
					.get(
						`assets/jp/thumb/chara/card${chunkId}_rip/${data.resourceId}_${type}.png`,
					)
					.arrayBuffer(),
			);
		}

		case "image": {
			return limit(() =>
				client
					.get(
						`assets/jp/characters/resourceset/${data.resourceId}_rip/card_${type}.png`,
					)
					.arrayBuffer(),
			);
		}
	}
};
