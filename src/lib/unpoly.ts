export const siblings = (el: HTMLElement) =>
	[...el.parentNode!.children].filter((it) => it !== el);

// select-card.astro
export const applyFormValueToSiblings = (
	el: HTMLElement,
	{ entries }: { entries: Record<"name" | "value", string>[] },
) => {
	for (const sibling of siblings(el)) {
		if (sibling instanceof HTMLInputElement) {
			const values = entries.filter((entry) => entry.name === sibling.name);
			sibling.value =
				values.length > 0 ? values.map(({ value }) => value).join("|") : "";
		}
	}
};
export const animateViewFullCard = (
	el: HTMLElement,
	layerElement: HTMLElement,
	reverse: boolean = false,
) => {
	const from = (
		reverse
			? [...layerElement.querySelectorAll("img")].at(
					[...layerElement.querySelectorAll("input")].findIndex(
						(input) => input.checked,
					),
				)
			: el.querySelector("img")
	)!;
	const to = (reverse ? el : layerElement).querySelector("img")!;

	if (!reverse && !to.complete) {
		// show placeholder if image is not yet loaded
		to.classList.add("skeleton");
		to.addEventListener("load", () => {
			to.classList.remove("skeleton");
		});
	}

	if (!document.startViewTransition) {
		to.classList.toggle("hidden", false);
		return;
	}

	const transitionName = "animate-full-card";
	from.style.viewTransitionName = transitionName;
	const transition = document.startViewTransition(() => {
		from.style.viewTransitionName = "";
		to.style.viewTransitionName = transitionName;
		to.classList.toggle("hidden", false);
	});

	transition.finished.finally(() => {
		to.style.viewTransitionName = "";
	});
};
