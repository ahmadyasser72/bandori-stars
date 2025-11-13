type Runtime = import("@astrojs/cloudflare").Runtime<CloudflareBindings>;

declare namespace App {
	interface Locals extends Runtime {
		search_options: Required<SearchOptions>;
	}

	type SearchOptions = Partial<
		Record<"oldest_first" | "show_trained", boolean>
	>;
	type CalculateOptions = {
		target_point: number;
		target_rank: number;
		read_event_story: boolean;
		daily_login: boolean;
		daily_live: boolean;
		song_get_ss_score: boolean;
		song_full_combo_level: number;
	};

	interface SessionData {
		card_filters: Partial<Record<"band" | "type" | "attribute", string[]>>;
		gacha_filters: Partial<Record<"character" | "type", string[]>>;
		search_options: SearchOptions;

		calculate_options: Partial<CalculateOptions>;
	}
}
