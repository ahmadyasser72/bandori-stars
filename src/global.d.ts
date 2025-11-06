declare global {
	interface ObjectConstructor {
		entries<T extends object>(o: T): Array<[keyof T, T[keyof T]]>;
		keys<T extends object>(o: T): Array<keyof T>;

		fromEntries<K extends string, V>(e: [K, V][]): Record<K, V>;
	}
}

export {};
