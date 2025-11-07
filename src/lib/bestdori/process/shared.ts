import type sharp from "sharp";

import { MAX_IMAGE_WIDTH } from "~/lib/bestdori/constants";

export const resizeOptions = {
	width: MAX_IMAGE_WIDTH,
	withoutEnlargement: true,
	kernel: "mks2021",
} satisfies sharp.ResizeOptions;
