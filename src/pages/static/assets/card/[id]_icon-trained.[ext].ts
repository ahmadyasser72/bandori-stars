import { bestdoriAsset } from "~/lib/bestdori";
import type { APIRoute } from "./_shared";

export const prerender = true;
export { getStaticPaths } from "./_shared";

export const GET: APIRoute = ({ props }) =>
	bestdoriAsset
		.card("icon", true, props.data)
		.then((data) => new Response(data));
