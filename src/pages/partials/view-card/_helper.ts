import type { Entry } from "@/contents/data";

export type FullCardModalOptions = Partial<
	Record<"auto_scroll" | "show_trained" | "show_gacha_list", boolean>
>;

export const showFullCardModalOnClick = (
	card: Pick<Entry<"card_map">, "id">,
	options: FullCardModalOptions,
) => ({
	href: `/partials/view-card/${card.id}`,
	"up-layer": "new",
	"up-size": "large",
	"up-scroll": "false",
	"up-history": "false",
	"up-params": JSON.stringify(options),
	"up-on-opened": "__unpoly_animateShowFullCard(this, layer.element)",
	"up-on-dismissed": "__unpoly_animateShowFullCard(this, layer.element, true)",
});
