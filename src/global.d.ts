type UnpolyUtilities = typeof import("~/lib/unpoly");

declare global {
	interface Window {
		applyFormValueToSiblings: UnpolyUtilities["applyFormValueToSiblings"];
		animateShowFullCard: UnpolyUtilities["animateShowFullCard"];
	}

	interface ObjectConstructor {
		entries<T extends object>(o: T): Array<[keyof T, T[keyof T]]>;
		keys<T extends object>(o: T): Array<keyof T>;

		fromEntries<K extends string, V>(e: [K, V][]): Record<K, V>;
	}
}

export {};
