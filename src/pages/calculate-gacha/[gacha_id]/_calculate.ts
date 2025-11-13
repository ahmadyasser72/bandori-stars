import { song_map, type Entry } from "@/contents/data";
import { dayjs } from "~/lib/date";
import { sum } from "~/lib/math";
import { STARS_FROM_DAILY_LOGIN } from "./_constants";

export const calculateEvents = (
	events: (Entry<"event_map"> | null)[],
	options: App.CalculateOptions,
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

export const calculateDaily = (
	{ from, to }: Record<"from" | "to", dayjs.Dayjs>,
	options: App.CalculateOptions,
) => {
	const dailyLogin = (() => {
		if (!options.daily_login) return 0;

		const days = to.diff(from, "days");
		return sum(
			Array.from(
				{ length: days },
				(_, idx) => STARS_FROM_DAILY_LOGIN[idx % STARS_FROM_DAILY_LOGIN.length],
			),
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

export const calculateSongs = (
	until: dayjs.Dayjs,
	options: App.CalculateOptions,
) =>
	[...song_map.values()]
		.filter(
			({ releasedAt, specialReleasedAt }) =>
				releasedAt.jp.isBefore(until) ||
				(specialReleasedAt && specialReleasedAt.jp.isBefore(until)),
		)
		.map((data) => ({
			fullCombo: Object.fromEntries(
				Object.entries(data.fullComboRewards)
					.filter(
						([, it]) =>
							it !== null && it.level <= options.song_full_combo_level,
					)
					.map(([difficulty, it]) => [difficulty, it!]),
			),
			score: options.song_get_ss_score
				? sum(Object.values(data.scoreRewards))
				: 0,
			data,
		}));
