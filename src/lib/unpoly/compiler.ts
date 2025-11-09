import { decode, isBlurhashValid } from "blurhash";

import { BLURHASH_SIZE } from "~/lib/bestdori/constants";

const blurhashMap = new Map<string, string>();
up.compiler("[data-blurhash]", { batch: true }, (elements) => {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach(({ isIntersecting, target }) => {
				if (!isIntersecting) return;
				else observer.unobserve(target);

				const element = target as HTMLImageElement;
				const original = element.dataset.original!;
				const img = new Image();
				img.src = original;

				const done = () => (element.src = original);
				if (img.complete) done();
				else img.addEventListener("load", done, { once: true });
			});
		},
		{ threshold: 0.67 },
	);

	for (const element of elements) {
		if (
			!(element instanceof HTMLImageElement) ||
			!isBlurhashValid(element.dataset.blurhash!).result ||
			element.complete
		)
			return;

		const hash = element.dataset.blurhash!;
		element.dataset.original = element.src;
		element.src =
			blurhashMap.get(hash) ??
			(() => {
				const canvas = document.createElement("canvas");
				canvas.width = canvas.height = BLURHASH_SIZE;

				const pixels = decode(hash, BLURHASH_SIZE, BLURHASH_SIZE);
				const ctx = canvas.getContext("2d")!;
				const imageData = ctx.createImageData(BLURHASH_SIZE, BLURHASH_SIZE);
				imageData.data.set(pixels);
				ctx.putImageData(imageData, 0, 0);

				const image = canvas.toDataURL();
				blurhashMap.set(hash, image);
				return image;
			})();

		observer.observe(element);
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
