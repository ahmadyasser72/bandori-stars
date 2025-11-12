type MaybePromise<T> = T | Promise<T>;

interface UnpolyLayer {
	element: HTMLElement;
}

interface Unpoly {
	compiler(
		selector: string,
		handler: (element: HTMLElement) => MaybePromise<void | (() => void)>,
	): void;
	compiler(
		selector: string,
		options: { batch: boolean },
		handler: (elements: HTMLElement[]) => MaybePromise<void | (() => void)>,
	): void;

	destructor(element: HTMLElement, callback: () => void): void;

	layer: {
		open(options: { url: string; origin: HTMLElement; params?: object }): void;
	};

	render(
		selector: string,
		options: { response: unknown; history?: boolean },
	): Promise<{ layer: UnpolyLayer }>;
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
