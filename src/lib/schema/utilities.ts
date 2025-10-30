type Nullable<T> = T | null;

export type RegionTuple<T, O = Nullable<T>> = [
	T, // JP
	O, // EN
	never, // TW
	never, // CN
	never, // KR
];
