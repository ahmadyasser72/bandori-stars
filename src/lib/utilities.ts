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

export const regionValue = {
	unwrap: <T>({ en, jp }: RegionValue<T>) => en ?? jp,
	match: <T>(
		{ en, jp }: RegionValue<T>,
		fn: (value: T | null) => boolean | undefined,
	) => (fn(en) || fn(jp)) === true,
};
