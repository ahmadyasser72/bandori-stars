const textEncoder = new TextEncoder();
export const toJsonResponse = <T extends object>(o: T) => {
	const json = JSON.stringify(
		o instanceof Map ? Object.fromEntries(o.entries()) : o,
	);

	return new Response(json, {
		headers: {
			"content-type": "application/json",
			"content-length": textEncoder.encode(json).byteLength.toString(),
		},
	});
};

export const emptyObjectIsNull = <T extends object>(o: T | {}): T | null =>
	Object.keys(o).length === 0 ? null : (o as T);

export const randomInt = (min: number, max: number) =>
	min + Math.floor(Math.random() * (max - min));

type RegionValue<T> = { jp: T; en: T | null };
type UnwrappedRegionValue<Entry, K extends keyof Entry> = {
	[P in K]: Entry[P] extends RegionValue<infer U> ? U : never;
};
type Simplify<T> = { [K in keyof T]: T[K] } & {};

export const regionValue = {
	unwrap: <T>({ en, jp }: RegionValue<T>) => en ?? jp,
	mapUnwrap:
		<Entry, K extends keyof Entry>(...keys: K[]) =>
		(entries: Entry[]) =>
			entries.map(
				(entry): Simplify<UnwrappedRegionValue<Entry, K> & Omit<Entry, K>> => ({
					...entry,
					...(Object.fromEntries(
						keys.map((k) => [
							k,
							regionValue.unwrap(entry[k] as RegionValue<Entry[typeof k]>),
						]),
					) as UnwrappedRegionValue<Entry, K>),
				}),
			),
	match: <T>(
		{ en, jp }: RegionValue<T>,
		fn: (value: T | null) => boolean | undefined,
	) => (fn(en) || fn(jp)) === true,
};
