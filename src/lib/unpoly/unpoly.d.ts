type MaybePromise<T> = T | Promise<T>;

interface UnpolyLayer {
	element: HTMLElement;
}

interface Unpoly {
	compiler<T extends HTMLElement = HTMLElement>(
		selector: string,
		handler: (element: T) => MaybePromise<void | (() => void)>,
	): void;
	compiler<T extends HTMLElement = HTMLElement>(
		selector: string,
		options: { batch: boolean },
		handler: (elements: T[]) => MaybePromise<void | (() => void)>,
	): void;

	destructor(element: HTMLElement, callback: () => void): void;

	layer: {
		open(options: { url: string; origin: HTMLElement; params?: object }): void;
	};

	render(
		selector: string,
		options: { response: unknown; history?: boolean },
	): Promise<{
		fragment: HTMLElement;
		layer: UnpolyLayer;
		finished: Promise<void>;
	}>;
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
