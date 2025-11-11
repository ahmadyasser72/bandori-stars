import "temporal-polyfill/global";

import type { JSX } from "astro/jsx-runtime";

import type { CalendarEvent } from "@schedule-x/calendar";
import * as devalue from "devalue";

export interface CalendarData {
	events: (CalendarEvent & {
		img?: JSX.ImgHTMLAttributes;
		stars: Record<string, number>;
	})[];
	options: App.CalculateOptions;
}

export const useCalendar = (data: CalendarData) => ({
	"data-calendar": devalue.stringify(data),
	class: "w-full h-120",
});
