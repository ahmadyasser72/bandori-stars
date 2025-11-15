import "./calendar";

up.compiler("form#calculate-gacha", (form) => {
	const updateSelectorList = new Set<string>();
	const DEBOUNCE_DURATION = 200;
	let debounceTimer: undefined | ReturnType<typeof setTimeout> = undefined;

	const handler = async (event: Event) => {
		if (!(event.target instanceof HTMLElement)) return;
		event.preventDefault();

		const fieldset = event.target.closest("fieldset")!;
		updateSelectorList.add(fieldset.dataset.update!);

		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(async () => {
			const selectors = [...updateSelectorList];
			updateSelectorList.clear();

			selectors.forEach((selector) => {
				const before = document.querySelector(selector)!;
				setTimeout(() => before.classList.add("opacity-50"), 150);
			});

			// @ts-expect-error https://unpoly.com/up:form:submit
			const { fragment, finished } = await up.render(event.renderOptions);
			await finished;

			await Promise.all(
				selectors.map(async (selector) => {
					const after = fragment.querySelector(selector)!;
					after.classList.add("flash-overlay", "flash");

					setTimeout(() => after.classList.remove("flash"), 0);
					after.addEventListener("transitionend", () =>
						after.classList.remove("flash-overlay"),
					);
				}),
			);
		}, DEBOUNCE_DURATION);
	};

	form.addEventListener("up:form:submit", handler);
	return () => form.removeEventListener("up:form:submit", handler);
});
