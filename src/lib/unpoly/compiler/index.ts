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

up.compiler<HTMLButtonElement>("button[data-play-audio]", (button) => {
	const audio = new Audio();

	const dropdown = button.closest<HTMLElement>(".dropdown");
	const afterPlay = () => {
		button.disabled = false;
		setTimeout(() => dropdown?.classList.toggle("dropdown-open", false), 500);
	};
	const play = () => {
		button.disabled = true;
		dropdown?.classList.toggle("dropdown-open", true);

		if (!audio.src) audio.src = button.dataset.playAudio!;
		audio.play();
	};

	audio.addEventListener("ended", afterPlay);
	button.addEventListener("click", play);
	return () => {
		button.removeEventListener("click", play);
		audio.removeEventListener("ended", afterPlay);
		audio.remove();
	};
});
