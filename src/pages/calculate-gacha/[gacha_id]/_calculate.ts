import { song_map, type Entry } from "@/contents/data";
import { dayjs } from "~/lib/date";
import { sum } from "~/lib/math";
import {
	STARS_FROM_DAILY_LOGIN,
	STARS_FROM_FREE_MONTHLY_PASS,
	STARS_FROM_PAID_MONTHLY_PASS,
} from "./_constants";

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
		if (!options.daily_login || to.isBefore(from)) return 0;

		const days = to.diff(from, "days");
		return sum(
			Array.from(
				{ length: days },
				(_, idx) => STARS_FROM_DAILY_LOGIN[idx % STARS_FROM_DAILY_LOGIN.length],
			),
		);
	})();

	const dailyLives = (() => {
		if (!options.daily_live || to.isBefore(from)) return 0;

		const weeks = to.diff(from, "weeks");
		return weeks;
	})();

	return {
		stars: { dailyLogin },
		starGachaTicket: { dailyLives },
	};
};

export const calculateMonthlyPass = (
	{ from, to }: Record<"from" | "to", dayjs.Dayjs>,
	options: App.CalculateOptions,
) => {
	if (options.monthly_pass_points === 0) return { stars: 0, months: 0 };

	const start = from.add(1, "months").startOf("months");
	const months = to.diff(start, "months");

	const type = options.monthly_pass_type;
	const monthlyPassStars = sum(
		(type === "free"
			? STARS_FROM_FREE_MONTHLY_PASS
			: [...STARS_FROM_PAID_MONTHLY_PASS, ...STARS_FROM_FREE_MONTHLY_PASS]
		)
			.filter(({ livePoints }) => livePoints <= options.monthly_pass_points)
			.map(({ stars }) => stars),
	);

	return { stars: monthlyPassStars * months, months };
};

export const calculateSongs = (
	until: dayjs.Dayjs,
	options: App.CalculateOptions,
) => {
	const isOnlySpecialRelease = (entry: Entry<"song_map">) =>
		entry.specialReleasedAt &&
		!entry.specialReleasedAt.jp.isSame(entry.releasedAt.jp);

	return [...song_map.values()]
		.filter(
			({ releasedAt, specialReleasedAt }) =>
				releasedAt.jp.isBefore(until) &&
				(!specialReleasedAt || specialReleasedAt.jp.isBefore(until)),
		)
		.map((data) => ({
			fullCombo: Object.fromEntries(
				Object.entries(data.fullComboRewards)
					.filter(([difficulty]) =>
						isOnlySpecialRelease(data) ? difficulty === "special" : true,
					)
					.filter(
						([, it]) =>
							it !== null && it.level <= options.song_full_combo_level,
					)
					.map(([difficulty, it]) => [difficulty, it!]),
			),
			score: isOnlySpecialRelease(data)
				? { s: 0, ss: 0 }
				: {
						s: options.song_s_score ? data.scoreRewards.s : 0,
						ss: options.song_ss_score ? data.scoreRewards.ss : 0,
					},
			data,
		}))
		.filter(
			({ fullCombo, score }) =>
				0 <
				sum([
					...Object.values(fullCombo).map(({ stars }) => stars),
					...Object.values(score),
				]),
		);
};
