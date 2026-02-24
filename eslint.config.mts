import eslint from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint, { ConfigArray } from "typescript-eslint";

const NEXT_APP_GLOBS = ["frontend/*/"];

function scopeToNextApps(configArray: ConfigArray) {
	return configArray.map(config => ({
		...config,
		files: (config.files ?? ["**/*.{js,jsx,ts,tsx}"]).flatMap(pattern =>
			NEXT_APP_GLOBS.map(appRoot => `${appRoot}${pattern}`)
		),
	}));
}

export default tseslint.config(
	scopeToNextApps(nextVitals),
	scopeToNextApps(nextTs),

	{
		files: NEXT_APP_GLOBS.map(p => `${p}**/*.{js,jsx,ts,tsx}`),
		settings: {
			next: { rootDir: NEXT_APP_GLOBS },
			react: { version: "19" },
		},
	},

	{
		ignores: [
			"eslint.config.mts",
			"**/dist/**",
			"**/build/**",
			"**/.next/**",
			"**/out/**",
			"**/next-env.d.ts",
		],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	eslintPluginPrettierRecommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},
			sourceType: "commonjs",
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		rules: {
			"prettier/prettier": ["error", { endOfLine: "auto" }],
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/no-floating-promises": "warn",
			"@typescript-eslint/no-unsafe-argument": "warn",
			"@typescript-eslint/explicit-function-return-type": [
				"error",
				{
					allowExpressions: true,
					allowTypedFunctionExpressions: true,
					allowHigherOrderFunctions: true,
					allowDirectConstAssertionInArrowFunctions: true,
				},
			],
			"@typescript-eslint/explicit-member-accessibility": [
				"error",
				{ accessibility: "explicit" },
			],
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					args: "all",
					argsIgnorePattern: "^_",
					caughtErrors: "all",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					ignoreRestSiblings: true,
				},
			],
			curly: ["error", "all"],
		},
	}
);
