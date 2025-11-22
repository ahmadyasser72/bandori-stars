import "./blurhash";
import "~/pages/calculate/[gacha_id]/_compiler";

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

up.compiler("[data-autoscroll]", (element) => {
	setTimeout(
		() =>
			element.scrollIntoView({
				behavior: "smooth",
				block: (element.dataset.autoscroll ||
					"nearest") as ScrollLogicalPosition,
			}),
		150,
	);
});

up.compiler("button[data-play-audio]", (element) => {
	if (!(element instanceof HTMLButtonElement)) return;
	const audio = new Audio(element.dataset.playAudio);

	const dropdown = element.closest<HTMLElement>(".dropdown");
	const enableButtonOnPlayEnd = () => {
		element.disabled = false;
		dropdown?.classList.remove("dropdown-open");
	};
	const playAudio = () => {
		element.disabled = true;
		dropdown?.classList.add("dropdown-open");
		audio.play();
	};

	audio.addEventListener("ended", enableButtonOnPlayEnd);
	element.addEventListener("click", playAudio);
	return () => {
		element.removeEventListener("click", playAudio);
		audio.removeEventListener("ended", enableButtonOnPlayEnd);
		audio.remove();
	};
});
