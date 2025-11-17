import { decode, isBlurhashValid } from "blurhash";

import { BLURHASH_SIZE } from "~/lib/bestdori/constants";

(() => {
	const cache = new Map<string, string>();
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

	up.compiler("[data-blurhash]", { batch: true }, (elements) => {
		for (const element of elements) {
			if (
				!(element instanceof HTMLImageElement) ||
				!isBlurhashValid(element.dataset.blurhash!).result ||
				element.complete
			)
				continue;

			const hash = element.dataset.blurhash!;
			element.dataset.original = element.src;
			element.src =
				cache.get(hash) ??
				(() => {
					const canvas = document.createElement("canvas");
					canvas.width = canvas.height = BLURHASH_SIZE;

					const pixels = decode(hash, BLURHASH_SIZE, BLURHASH_SIZE);
					const ctx = canvas.getContext("2d")!;
					const imageData = ctx.createImageData(BLURHASH_SIZE, BLURHASH_SIZE);
					imageData.data.set(pixels);
					ctx.putImageData(imageData, 0, 0);

					const image = canvas.toDataURL();
					cache.set(hash, image);
					return image;
				})();

			observer.observe(element);
			up.destructor(element, () => observer.unobserve(element));
		}
	});
})();
