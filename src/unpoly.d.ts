interface Unpoly {
	compiler: (
		selector: string,
		handler: (element: HTMLElement) => void | (() => void),
	) => void;
}

declare global {
	const up: Unpoly;
}

export {};
