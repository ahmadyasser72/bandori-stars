import type { APIContext } from "astro";

export const getOptions = async (context: APIContext) => {
	const params = context.url.searchParams;
	const sessionOptions = await context.session?.get("calculate_options");

	type OptionName = keyof App.CalculateOptions;
	const getNumber = (name: OptionName) => {
		const value = params.size > 0 ? params.get(name) : sessionOptions?.[name];
		const number = Number(value ?? NaN);
		return Number.isNaN(number) || number <= 0 ? 0 : number;
	};
	const getBoolean = (name: OptionName) =>
		params.size > 0 ? params.get(name) === "true" : !!sessionOptions?.[name];

	const options = {
		target_point: getNumber("target_point"),
		target_rank: getNumber("target_rank"),
		read_event_story: getBoolean("read_event_story"),

		daily_login: getBoolean("daily_login"),
		daily_live: getBoolean("daily_live"),

		monthly_pass_type: (() => {
			const value =
				params.size > 0
					? params.get("monthly_pass_type")
					: sessionOptions?.monthly_pass_type;
			return value === "free" || value === "paid" ? value : "free";
		})(),
		monthly_pass_points: getNumber("monthly_pass_points"),

		song_s_score: getBoolean("song_s_score"),
		song_ss_score: getBoolean("song_ss_score"),
		song_full_combo_level: getNumber("song_full_combo_level"),
	} satisfies App.CalculateOptions;

	context.session?.set("calculate_options", options);
	return options;
};
