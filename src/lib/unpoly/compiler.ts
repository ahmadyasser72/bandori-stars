import { decode, isBlurhashValid } from "blurhash";

import { BLURHASH_SIZE } from "~/lib/bestdori/constants";

up.compiler("[data-blurhash]", { batch: true }, (elements) => {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach(({ isIntersecting, target }) => {
				if (!isIntersecting) return;
				else observer.unobserve(target);

				const el = target as HTMLImageElement;
				const original = el.dataset.original!;
				const img = new Image();
				img.src = original;

				const done = () => (el.src = original);
				if (img.complete) done();
				else img.addEventListener("load", done, { once: true });
			});
		},
		{ threshold: 0.67 },
	);

	for (const el of elements) {
		if (
			!(el instanceof HTMLImageElement) ||
			!isBlurhashValid(el.dataset.blurhash!).result ||
			el.complete
		)
			return;

		const pixels = decode(el.dataset.blurhash!, BLURHASH_SIZE, BLURHASH_SIZE);
		const canvas = document.createElement("canvas");
		canvas.width = canvas.height = BLURHASH_SIZE;
		const ctx = canvas.getContext("2d")!;
		const imageData = ctx.createImageData(BLURHASH_SIZE, BLURHASH_SIZE);
		imageData.data.set(pixels);
		ctx.putImageData(imageData, 0, 0);

		el.dataset.original = el.src;
		el.src = canvas.toDataURL();
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
