jest.mock("@orpc/contract", () => ({
	oc: {
		route: () => ({
			input: () => ({
				output: (outputArg: unknown) => outputArg,
			}),
		}),
	},
	populateContractRouterPaths: (arg: unknown) => arg,
}));

jest.mock("@orpc/nest", () => ({
	Implement: () => (arg: unknown) => arg,
	implement: (arg: unknown) => arg,
}));
