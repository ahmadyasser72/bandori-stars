import "temporal-polyfill/global";
import "@schedule-x/theme-default/dist/index.css";
import "./override.css";

import type { CalendarData } from "./helper";

up.compiler("[data-calendar]", async (element) => {
	const devalue = await import("devalue");
	const { createCalendar, createViewMonthGrid } = await import(
		"@schedule-x/calendar"
	);

	const data: CalendarData = devalue.parse(element.dataset.calendar!);
	const events = new Map(data.events.map((event) => [event.id, event]));

	const calendar = createCalendar({
		isResponsive: false,
		views: [createViewMonthGrid()],

		minDate: data.events.at(0)?.start as Temporal.PlainDate,
		maxDate: data.events.at(-1)?.end as Temporal.PlainDate,

		events: data.events,
		callbacks: {
			onEventClick: ({ id }, clickEvent) => {
				const event = events.get(id)!;
				up.layer.open({
					url: `/calculate/gacha/_/partials/event-details/${event.id}`,
					origin: clickEvent.target as HTMLElement,
					params: data.options,
				});
			},
		},
	});

	const isDark = window.matchMedia("(prefers-color-scheme: dark)");
	isDark.addEventListener("change", (event) => {
		calendar.setTheme(event.matches ? "dark" : "light");
	});

	if (isDark.matches) calendar.setTheme("dark");
	calendar.render(element);

	return () => calendar.destroy();
});
