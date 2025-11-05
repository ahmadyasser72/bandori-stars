import { bestdoriAsset } from "~/lib/bestdori";
import type { APIRoute } from "./_shared";

export const prerender = true;
export { getStaticPaths } from "./_shared";

export const GET: APIRoute = ({ params, props }) =>
	bestdoriAsset
		.card(params.type, true, props.data)
		.then((data) => new Response(data));
