import type { APIContext } from "astro";

export const getOptions = async (context: APIContext) => {
	const params = context.url.searchParams;
	const sessionOptions = await context.session!.get("calculate_options");

	const getNumber = (name: "target_point" | "target_rank") => {
		const value = params.size > 0 ? params.get(name) : sessionOptions?.[name];
		const number = Number(value ?? NaN);
		return Number.isNaN(number) || number <= 0 ? 0 : number;
	};

	const options = {
		target_point: getNumber("target_point"),
		target_rank: getNumber("target_rank"),
		read_stories:
			params.size > 0
				? params.get("read_stories") === "true"
				: !!sessionOptions?.read_stories,
	};

	context.session!.set("calculate_options", options);
	return options;
};
