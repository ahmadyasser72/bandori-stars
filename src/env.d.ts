type NetlifyLocals = import("@astrojs/netlify").NetlifyLocals;

declare namespace App {
	interface Locals extends NetlifyLocals {}
	interface SessionData {
		card_search_filters: Partial<Record<"band" | "type" | "attribute", string>>;
		card_search_options: Partial<
			Record<"oldest_first" | "show_trained", string>
		>;
	}
}
