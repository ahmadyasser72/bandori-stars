import type {
	APIRoute,
	GetStaticPaths,
	InferGetStaticParamsType,
	InferGetStaticPropsType,
} from "astro";

import * as data from "@/contents/data";
import { toJsonResponse } from "~/lib/utilities";

export const prerender = true;

export const GET: APIRoute<Props, Params> = ({ props }) =>
	toJsonResponse({
		items: props.page.data,
		total: props.page.total,
		page: props.page.currentPage,
		prev: props.page.url.prev,
		next: props.page.url.next,
	});

export const getStaticPaths = (({ paginate }) =>
	Object.entries(data).flatMap(([key, map]) =>
		paginate([...map.values()], {
			pageSize: 100,
			params: { name: key.split("_")[0] },
		}),
	)) satisfies GetStaticPaths;

type Params = InferGetStaticParamsType<typeof getStaticPaths>;
type Props = InferGetStaticPropsType<typeof getStaticPaths>;
