import { bestdori } from "~/lib/bestdori";
import type { APIRoute } from "./_shared";

export const prerender = true;
export { getStaticPaths } from "./_shared";

export const GET: APIRoute = ({ params, props }) =>
	bestdori.asset
		.card(params.type, true, props.data)
		.then((data) => new Response(data));
