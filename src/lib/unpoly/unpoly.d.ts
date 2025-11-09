interface Unpoly {
	compiler(
		selector: string,
		handler: (element: HTMLElement) => void | (() => void),
	): void;
	compiler(
		selector: string,
		options: { batch: boolean },
		handler: (elements: HTMLElement[]) => void | (() => void),
	): void;

	destructor(element: HTMLElement, callback: () => void): void;

	render(
		selector: string,
		options: { response: unknown; history?: boolean },
	): Promise<{ layer: UnpolyLayer }>;
}

interface UnpolyLayer {
	element: HTMLElement;
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

		__unpoly_animateSelectGacha: (event: {
			value: { id: string };
			layer: UnpolyLayer;
			response: unknown;
		}) => void;
	}
}

export {};
