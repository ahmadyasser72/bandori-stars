import type { APIContext } from "astro";

import type { Document, DocumentData, DocumentOptions } from "flexsearch";

export const documentOptions = {
	tokenize: "tolerant",
	cache: false,
	store: false,
} satisfies DocumentOptions;

export const doSearch = <T extends DocumentData>(
	document: Document<T>,
	query: string,
) =>
	document
		.search({ query, suggest: true })
		.flatMap((entries) => entries.result.map((id) => id.toString()));

export type Filter<E> = {
	label: string;
	props: { name: string } & Record<string, string>;
	options: ({ value: string } & Record<string, string>)[];
	getValue: (entry: E) => string | string[];
};

interface Search<T, S> {
	context: APIContext;
	sessionKey: S;
	data_map: Map<string, T>;
	pageSize: number;
	filterList: Filter<T>[];
	searchFn: (query: string, oldestFirst: boolean) => string[];
}

export const search = async <
	T,
	S extends keyof Pick<App.SessionData, "card_filters" | "gacha_filters">,
>({
	context,
	sessionKey,
	data_map,
	filterList,
	pageSize,
	searchFn,
}: Search<T, S>) => {
	const params = context.url.searchParams;
	const sessionFilters = await context.session!.get(sessionKey);
	const sessionOptions = await context.session!.get("search_options");

	const pageQuery = Number(params.get("page") ?? NaN);
	const currentPage = Math.max(1, Number.isNaN(pageQuery) ? 1 : pageQuery);
	const offset = pageSize * (currentPage - 1);

	const nextPage = new URL(context.url);
	nextPage.searchParams.set("page", `${currentPage + 1}`);

	const filters = filterList.map(({ props: { name }, getValue }) => ({
		name,
		getValue,
		values: params.get(name),
	}));
	const filterMap = Object.fromEntries(
		filters.map(({ name, values }) => [
			name,
			(values?.split("|") ?? sessionFilters?.[name as never] ?? []).filter(
				Boolean,
			),
		]),
	);

	const getOption = (name: keyof App.SearchOptions) =>
		params.size > 0 ? params.get(name) === "true" : !!sessionOptions?.[name];
	const options = {
		oldest_first: getOption("oldest_first"),
		show_trained: getOption("show_trained"),
	};

	const query = params.get("query")?.toLowerCase();
	const items = (() => {
		if (query) {
			return searchFn(query, options.oldest_first);
		}

		const keys = [...data_map.keys()];
		return options.oldest_first ? keys : keys.reverse();
	})().map((id) => data_map.get(id)!);

	const results = filters
		.reduce((items, { name, getValue }) => {
			const predicates = filterMap[name];

			return items.filter((entry) => {
				const entryValue = getValue(entry);

				return Array.isArray(entryValue)
					? entryValue.some((value) => !predicates.includes(value))
					: predicates.every((value) => value !== entryValue);
			});
		}, items)
		.slice(offset, offset + pageSize);

	context.session!.set(sessionKey, filterMap as never);
	context.session!.set("search_options", options);

	return {
		results,
		filterMap,
		options,
		page: { size: pageSize, current: currentPage, next: nextPage },
	};
};
