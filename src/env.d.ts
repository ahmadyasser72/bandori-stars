type Runtime = import("@astrojs/cloudflare").Runtime<CloudflareBindings>;

declare namespace App {
	interface Locals extends Runtime {
		search_options: Required<SearchOptions>;
	}

	type SearchOptions = Partial<
		Record<"oldest_first" | "show_trained", boolean>
	>;
	interface SessionData {
		card_filters: Partial<Record<"band" | "type" | "attribute", string[]>>;
		gacha_filters: Partial<Record<"character" | "type", string[]>>;
		search_options: SearchOptions;
	}
}
