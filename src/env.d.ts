type NetlifyLocals = import("@astrojs/netlify").NetlifyLocals;

declare namespace App {
	interface Locals extends NetlifyLocals {}
	interface SessionData {
		card_filters: Partial<
			Record<
				(typeof import("~/lib/search/card"))["filterList"][number]["props"]["name"],
				string
			>
		>;
	}
}
