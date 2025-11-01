import type {
	APIRoute as AstroAPIRoute,
	GetStaticPaths,
	InferGetStaticParamsType,
	InferGetStaticPropsType,
} from "astro";
import { getCollection } from "astro:content";

export const getStaticPaths = (async () => {
	const entries = await getCollection("card");

	return entries.map(({ id, data }) => ({ params: { id }, props: { data } }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;
export type APIRoute = AstroAPIRoute<Props, Params>;
