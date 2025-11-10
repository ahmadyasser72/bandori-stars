import type { Entry } from "@/contents/data";
import { dayjs } from "~/lib/date";
import { sum } from "~/lib/math";
import {
	STARS_FROM_DAILY_LOGIN,
	WEEKLY_STARS_FROM_DAILY_LOGIN,
} from "./_constants";

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
				options.target_rank === 0
					? 0
					: (data.rankingRewards.find(({ rank }) => rank >= options.target_rank)
							?.stars ?? 0),
			story: options.read_event_story ? data.storyRewards : 0,
			data,
		}));

export const calculatePassive = (
	{ from, to }: Record<"from" | "to", dayjs.Dayjs>,
	options: Required<App.SessionData["calculate_options"]>,
) => {
	const dailyLogin = (() => {
		if (!options.daily_login) return 0;

		const days = to.diff(from, "days");

		const weeks = Math.floor(days / 7);
		const leftOverDays = days % 7;
		return (
			weeks * WEEKLY_STARS_FROM_DAILY_LOGIN +
			sum(STARS_FROM_DAILY_LOGIN.slice(0, leftOverDays))
		);
	})();

	const dailyLives = (() => {
		if (!options.daily_live) return 0;

		const weeks = to.diff(from, "weeks");
		return weeks;
	})();

	return {
		stars: { dailyLogin },
		starGachaTicket: { dailyLives },
	};
};
