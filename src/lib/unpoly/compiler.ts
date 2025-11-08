import { BLURHASH_IMAGE_FORMAT, IMAGE_FORMAT } from "~/lib/bestdori/constants";

up.compiler("[data-blurhash]", (el) => {
	if (!(el instanceof HTMLImageElement) || el.complete) return;

	const blurhashImage = new Image();
	blurhashImage.src = el.src.replace(IMAGE_FORMAT, BLURHASH_IMAGE_FORMAT);

	el.style.zIndex = "1";
	el.className = blurhashImage.className = "absolute w-full";
	el.insertAdjacentElement("afterend", blurhashImage);
});

up.compiler(".radio-group", (fieldset) => {
	const isToggleAll = (el: HTMLInputElement) => el.ariaLabel === "All";

	fieldset.addEventListener("input", (event) => {
		if (event.target instanceof HTMLInputElement) {
			const inputs = [
				...(fieldset.querySelectorAll(
					`input[name="${event.target.name}"]`,
				) as NodeListOf<HTMLInputElement>),
			].filter((el) => el !== event.target);

			if (isToggleAll(event.target)) {
				for (const input of inputs) input.checked = event.target.checked;
			} else {
				const [toggleAll] = inputs.splice(inputs.findIndex(isToggleAll), 1);

				toggleAll.checked = [...inputs, event.target].some((el) => el.checked);
			}
		}
	});
});

up.compiler(".scroll-here", (el) => {
	setTimeout(
		() =>
			el.scrollIntoView({
				behavior: "smooth",
				block: (el.dataset.scrollHere ?? "nearest") as ScrollLogicalPosition,
			}),
		150,
	);
});
