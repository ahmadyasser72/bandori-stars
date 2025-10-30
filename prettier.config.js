/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	trailingComma: "all",
	semi: true,
	singleQuote: false,
	useTabs: true,

	plugins: [
		"prettier-plugin-astro",
		"prettier-plugin-tailwindcss",
		"@ianvs/prettier-plugin-sort-imports",
	],
	overrides: [{ files: "*.astro", options: { parser: "astro" } }],
	importOrder: ["^astro", "", "<THIRD_PARTY_MODULES>", "", "^~/(.*)$", "^[./]"],
};

export default config;
