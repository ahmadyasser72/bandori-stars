interface Unpoly {
	compiler: (
		selector: string,
		handler: (element: HTMLElement) => void | (() => void),
	) => void;
}

declare global {
	const up: Unpoly;

	interface Window {
		__unpoly_applyFormValueToSiblingInputs: (
			el: HTMLElement,
			entries: Record<"name" | "value", string>[],
		) => void;
		__unpoly_animateShowFullCard: (
			el: HTMLElement,
			layerElement: HTMLElement,
			reverse?: boolean,
		) => void;
	}
}

export {};
