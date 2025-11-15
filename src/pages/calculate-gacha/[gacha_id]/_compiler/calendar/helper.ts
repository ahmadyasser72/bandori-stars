import "temporal-polyfill/global";

import type { CalendarEvent } from "@schedule-x/calendar";
import * as devalue from "devalue";

export interface CalendarData {
	events: CalendarEvent[];
	recurrenceEvents: (CalendarEvent & { rrule: string })[];
	options: App.CalculateOptions;
}

export const useCalendar = (data: CalendarData) => ({
	"data-calendar": devalue.stringify(data),
	class: "w-full min-w-4xl h-108",
});
