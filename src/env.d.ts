type NetlifyLocals = import("@astrojs/netlify").NetlifyLocals;

declare namespace App {
	interface Locals extends NetlifyLocals {}

	type SearchOptions = Partial<
		Record<"oldest_first" | "show_trained", boolean>
	>;
	interface SessionData {
		card_search: {
			filters: Partial<Record<"band" | "type" | "attribute", string[]>>;
			options: SearchOptions;
		};
		gacha_search: {
			filters: Partial<Record<"character" | "type", string[]>>;
			options: SearchOptions;
		};
	}
}
