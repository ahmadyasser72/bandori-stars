export const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

const numberFormatter = new Intl.NumberFormat("de-DE", {
	style: "decimal",
	notation: "standard",
});
export const formatNumber = (value: number) => numberFormatter.format(value);
