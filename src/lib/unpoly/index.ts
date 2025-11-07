import "unpoly";
import "./minimustache";
import "./compiler";

const siblings = (el: HTMLElement) =>
	[...el.parentNode!.children].filter((it) => it !== el);

window.__unpoly_applyFormValueToSiblingInputs = (el, entries) => {
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

window.__unpoly_animateShowFullCard = (el, layerElement, reverse = false) => {
	const iconImage = el.closest("li")!.querySelector("img")!;
	const fullImage =
		layerElement
			.querySelector("input:checked")
			?.nextElementSibling?.querySelector("img") ??
		layerElement.querySelector("img")!;

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

	if (!document.startViewTransition) return;

	const transitionName = "animate-full-card";
	from.style.viewTransitionName = transitionName;
	const transition = document.startViewTransition(() => {
		from.style.viewTransitionName = "";
		to.style.viewTransitionName = transitionName;
	});

	transition.finished.finally(() => {
		to.style.viewTransitionName = "";
	});
};
