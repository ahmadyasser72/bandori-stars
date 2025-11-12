export const capitalize = (s: string) =>
	s.length === 0 ? "" : s.at(0)!.toUpperCase() + s.slice(1);

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
	map: <T, Result>(
		{ en, jp }: RegionValue<T>,
		mapper: (value: NonNullable<T>, region: "jp" | "en") => Result,
	): { jp: T extends null ? Result | null : Result; en: Result | null } => {
		const wrapper = (value: T | null, region: "jp" | "en") => {
			if (!value) return null;
			const out = mapper(value, region);
			return Array.isArray(out) && out.length === 0 ? null : out;
		};

		return {
			jp: wrapper(jp, "jp") as Result,
			en: wrapper(en, "en"),
		};
	},
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
