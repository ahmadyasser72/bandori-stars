import type { Entry } from "@/contents/data";
import type { Params } from "./_params";

export const calculateEvents = (events: Entry<"event_map">[], params: Params) =>
	events.map((data) => ({
		point:
			data.pointRewards
				.slice()
				.reverse()
				.find(({ point }) => point <= params.point)?.stars ?? 0,
		rank:
			data.rankingRewards.find(({ rank }) => rank >= params.rank)?.stars ?? 0,
		story: params.readStories ? data.storyRewards : 0,
		data,
	}));
