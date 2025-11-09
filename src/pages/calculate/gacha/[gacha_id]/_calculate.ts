import type { Entry } from "@/contents/data";

export const calculateEvents = (
	events: (Entry<"event_map"> | null)[],
	options: Required<App.SessionData["calculate_options"]>,
) =>
	events
		.filter((data) => data !== null)
		.map((data) => ({
			point:
				data.pointRewards.findLast(({ point }) => point <= options.target_point)
					?.stars ?? 0,
			rank:
				data.rankingRewards.find(({ rank }) => rank >= options.target_rank)
					?.stars ?? 0,
			story: options.read_stories ? data.storyRewards : 0,
			data,
		}));
