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
	if (!document.startViewTransition) return;

	const iconImage = el.closest("li")!.querySelector("img")!;
	const fullImage =
		layerElement
			.querySelector("input:checked")
			?.nextElementSibling?.querySelector("img") ??
		layerElement.querySelector("img")!;

	const [from, to] = reverse ? [fullImage, iconImage] : [iconImage, fullImage];

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

window.__unpoly_animateSelectGacha = ({ value, layer, response }) => {
	if (!document.startViewTransition) return;

	const elementId = `#gacha-card-${value.id}`;
	const from = layer.element.querySelector<HTMLElement>(elementId)!;

	const transitionName = "animate-select-gacha";
	from.style.viewTransitionName = transitionName;
	const transition = document.startViewTransition(async () => {
		from.style.viewTransitionName = "";

		const { layer } = await up.render("main", { response, history: true });
		const to = layer.element.querySelector<HTMLElement>(elementId)!;
		to.style.viewTransitionName = transitionName;
		transition.finished.finally(() => (to.style.viewTransitionName = ""));
	});
};
