import { defineCollection } from "astro:content";

import constants from "./constants";
import * as loader from "./loader";
import * as schema from "./schema";

export * as parser from "./parser";
export { constants, loader, schema };

export const getCollection = <
	K extends keyof typeof loader & keyof typeof schema.loader,
>(
	key: K,
) => defineCollection({ loader: loader[key], schema: schema.loader[key] });
