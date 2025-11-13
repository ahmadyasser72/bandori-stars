import type { APIContext } from "astro";

interface PaginateParams<T> {
	context: APIContext;
	pageSize: number;
	items: T[];
}

export const paginate = <T>({
	context,
	items,
	pageSize,
}: PaginateParams<T>) => {
	const pageQuery = Number(context.url.searchParams.get("page") ?? NaN);
	const currentPage = Math.max(1, Number.isNaN(pageQuery) ? 1 : pageQuery);
	const offset = pageSize * (currentPage - 1);

	const nextPage = new URL(context.url);
	nextPage.searchParams.set("page", `${currentPage + 1}`);

	return {
		results: items.slice(offset, offset + pageSize),
		page: { size: pageSize, current: currentPage, next: nextPage },
	};
};
