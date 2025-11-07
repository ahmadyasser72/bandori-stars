import { IMAGE_FORMAT } from "~/lib/bestdori/constants";

up.compiler("[data-blurhash]", (el) => {
	if (!(el instanceof HTMLImageElement)) return;

	const loadImage = () => {
		const img = new Image();
		img.src = el.src.replace(`blurhash.${IMAGE_FORMAT}`, IMAGE_FORMAT);
		const done = () => (el.src = img.src);

		if (img.complete) done();
		else img.addEventListener("load", done);
	};

	if (el.height > 0) {
		loadImage();
	} else {
		const observer = new IntersectionObserver((entries) =>
			entries.forEach(({ isIntersecting }) => {
				if (el.complete) observer.unobserve(el);
				else if (isIntersecting) {
					loadImage();
					observer.unobserve(el);
				}
			}),
		);

		observer.observe(el);
	}
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
