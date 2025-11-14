import "temporal-polyfill/global";

import type { CalendarData } from "./helper";

up.compiler("[data-calendar]", async (element) => {
	const devalue = await import("devalue");
	const { createCalendar, createViewMonthGrid } = await import(
		"@schedule-x/calendar"
	);
	const { createEventRecurrencePlugin } = await import(
		"@schedule-x/event-recurrence"
	);

	const data: CalendarData = devalue.parse(element.dataset.calendar!);
	const events = new Map(data.events.map((event) => [event.id, event]));

	const calendar = createCalendar({
		plugins: [createEventRecurrencePlugin()],

		isResponsive: false,
		views: [createViewMonthGrid()],
		calendars: {
			"event-stars": {
				colorName: "eventstars",
				label: "Event stars",
				lightColors: {
					main: "var(--color-primary-content)",
					container: "var(--color-primary)",
					onContainer: "var(--color-primary-content)",
				},
			},
			"passive-stars": {
				colorName: "passivestars",
				label: "Passive stars",
				lightColors: {
					main: "var(--color-secondary-content)",
					container: "var(--color-secondary)",
					onContainer: "var(--color-secondary-content)",
				},
			},
		},

		minDate: data.events.at(0)?.start as Temporal.PlainDate,
		maxDate: data.events.at(-1)?.end as Temporal.PlainDate,

		events: [...data.events, ...data.recurrenceEvents],
		callbacks: {
			onEventClick: ({ id, calendarId }, clickEvent) => {
				if (calendarId === "event-stars") {
					const event = events.get(id)!;
					up.layer.open({
						url: `/calculate-gacha/_/partials/event-details/${event.id}`,
						origin: clickEvent.target as HTMLElement,
						params: data.options,
					});
				}
			},
		},
	});

	calendar.render(element);
	return () => calendar.destroy();
});
