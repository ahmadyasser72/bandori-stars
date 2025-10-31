import { defineCollection } from "astro:content";
import type { CollectionConfig } from "astro/content/config";

import constants from "./constants";
import * as loader from "./loader";
import * as schema from "./schema";

export * as parser from "./parser";
export { constants, loader, schema };

type Loader = keyof typeof loader;
type LoaderSchema = typeof schema.loader;

export const getCollectionConfig = <K extends Loader>(
	key: K,
): CollectionConfig<LoaderSchema[K]> =>
	defineCollection({
		loader: loader[key],
		schema: schema.loader[key] as never,
	});
