import type {
	APIRoute,
	GetStaticPaths,
	InferGetStaticParamsType,
	InferGetStaticPropsType,
} from "astro";

import * as data from "@/contents/data";

import { toJsonResponse } from "~/lib/utilities";

export const prerender = true;

export const GET: APIRoute<Props, Params> = async ({ props }) =>
	toJsonResponse(props.data);

export const getStaticPaths = (() =>
	Object.entries(data).flatMap(([key, data]) => ({
		params: { id: key.split("_")[0] },
		props: { data },
	}))) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;
