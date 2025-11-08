import { BLURHASH_IMAGE_FORMAT, IMAGE_FORMAT } from "~/lib/bestdori/constants";

up.compiler("[data-blurhash]", (el) => {
	if (!(el instanceof HTMLImageElement) || el.complete) return;

	const timeout = setTimeout(() => {
		const original = el.src;
		el.src = el.src.replace(IMAGE_FORMAT, BLURHASH_IMAGE_FORMAT);
		el.loading = "eager";

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach(({ isIntersecting }) => {
					if (!isIntersecting) return;

					observer.disconnect();
					const img = new Image();
					img.src = original;
					const done = () => (el.src = original);
					if (img.complete) done();
					img.addEventListener("load", done);
				});
			},
			{ threshold: 0.67 },
		);
		observer.observe(el);
	}, 200);

	el.addEventListener("load", () => clearTimeout(timeout));
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
