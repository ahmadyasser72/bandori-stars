import type { Entry } from "@/contents/data";

import { client, limit } from "./client";

const hasNoPreTrained = ({ name, type }: Entry<"card_map">) =>
	name.en === "Graduation" || ["kirafes", "birthday"].includes(type);

export const card = async (
	kind: "icon" | "image",
	trained: boolean,
	data: Entry<"card_map">,
) => {
	const type = trained || hasNoPreTrained(data) ? "after_training" : "normal";

	switch (kind) {
		case "icon": {
			const chunkId = Math.floor(Number(data.id) / 50)
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
