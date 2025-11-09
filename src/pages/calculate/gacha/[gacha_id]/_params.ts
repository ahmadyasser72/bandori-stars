import type { APIContext } from "astro";

export const getParams = (context: APIContext) => {
	const params = context.url.searchParams;
	const getNumber = (name: string) => {
		const value = params.get(name);
		const number = Number(value ?? NaN);
		return Number.isNaN(number) || number <= 0 ? 0 : number;
	};

	return {
		point: getNumber("target_point"),
		rank: getNumber("target_rank") || Number.POSITIVE_INFINITY,
		readStories: params.get("read_stories") === "true",
	};
};

export type Params = ReturnType<typeof getParams>;
