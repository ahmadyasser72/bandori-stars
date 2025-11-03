export const siblings = (el: HTMLElement) =>
	[...el.parentNode!.children].filter((it) => it !== el);

// select-card.astro
export const applyFormValueToSiblings = (
	el: HTMLElement,
	{ entries }: { entries: Record<"name" | "value", string>[] },
) => {
	for (const sibling of siblings(el)) {
		if (sibling instanceof HTMLInputElement) {
			const entry = entries.find((entry) => entry.name === sibling.name);
			if (entry) sibling.value = entry.value === "false" ? "" : entry.value;
		}
	}
};
