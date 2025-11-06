export const siblings = (el: HTMLElement) =>
	[...el.parentNode!.children].filter((it) => it !== el);

export const applyFormValueToSiblings = (
	el: HTMLElement,
	{ entries }: { entries: Record<"name" | "value", string>[] },
) => {
	for (const sibling of siblings(el)) {
		if (sibling instanceof HTMLInputElement) {
			const values = entries.filter((entry) => entry.name === sibling.name);
			sibling.value =
				values.length > 0
					? values
							.map(({ value }) => value)
							.filter(Boolean)
							.join("|")
					: "";
		}
	}
};
export const animateShowFullCard = (
	el: HTMLElement,
	layerElement: HTMLElement,
	reverse: boolean = false,
) => {
	const iconImage = el.closest("li")!.querySelector("img")!;
	const fullImage = layerElement
		.querySelector("input:checked")
		?.nextElementSibling?.querySelector("img")!;

	const [from, to] = reverse ? [fullImage, iconImage] : [iconImage, fullImage];

	if (!reverse && !to.complete) {
		layerElement
			.querySelectorAll("input")
			.forEach((input) => (input.disabled = true));
		to.classList.add("skeleton");

		to.addEventListener("load", () => {
			to.classList.remove("skeleton");
			layerElement
				.querySelectorAll("input")
				.forEach((input) => (input.disabled = false));
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
