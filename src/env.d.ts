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
}

export {};
