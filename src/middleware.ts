import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
	if (context.isPrerendered) return next();

	const params = context.url.searchParams;
	const sessionOptions = await context.session?.get("search_options");

	const getOption = (name: keyof App.SearchOptions) =>
		params.has("page") ? params.get(name) === "true" : !!sessionOptions?.[name];
	context.locals.search_options = {
		oldest_first: getOption("oldest_first"),
		show_trained: getOption("show_trained"),
	};
	context.session?.set("search_options", context.locals.search_options);

	return next();
};
