type NetlifyLocals = import("@astrojs/netlify").NetlifyLocals;

declare namespace App {
	interface Locals extends NetlifyLocals {}
	interface SessionData {}
}

type UnpolyUtilities = typeof import("~/lib/unpoly");

declare global {
	interface Window {
		applyFormValueToSiblings: UnpolyUtilities["applyFormValueToSiblings"];
	}

	interface ObjectConstructor {
		entries<T extends object>(o: T): Array<[keyof T, T[keyof T]]>;
		keys<T extends object>(o: T): Array<keyof T>;

		fromEntries<K extends string, V>(e: [K, V][]): Record<K, V>;
	}
}

export {};
