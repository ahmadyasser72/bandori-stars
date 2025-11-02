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
	toJsonResponse({ keys: props.keys });

export const getStaticPaths = (() =>
	Object.entries(data).map(([key, data]) => ({
		params: { name: key.split("_")[0] },
		props: { keys: [...data.keys()] },
	}))) satisfies GetStaticPaths;

type Params = InferGetStaticParamsType<typeof getStaticPaths>;
type Props = InferGetStaticPropsType<typeof getStaticPaths>;
