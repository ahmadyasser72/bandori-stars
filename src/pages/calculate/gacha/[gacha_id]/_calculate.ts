import type { Entry } from "@/contents/data";
import { dayjs } from "~/lib/date";

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
			story: options.read_stories ? data.storyRewards : 0,
			data,
		}));

export const calculatePassive = ({
	from,
	to,
}: Record<"from" | "to", dayjs.Dayjs>) => {
	// source: https://bandori.fandom.com/wiki/BanG_Dream!_Girls_Band_Party!/Login_Bonus#Normal_Login_Bonus
	const dailyLogin = (() => {
		const days = to.diff(from, "days");

		const weeks = Math.floor(days / 7);
		const weeklyStars = weeks * 150;

		const leftOverDays = days % 7;
		let extra = 0;
		if (leftOverDays >= 4) extra = 100;
		else if (leftOverDays >= 2) extra = 50;

		return { stars: weeklyStars + extra };
	})();

	const dailyLives = (() => {
		const weeks = to.diff(from, "weeks");
		return { starGachaTicket: weeks };
	})();

	return { dailyLogin, dailyLives };
};
