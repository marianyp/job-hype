import * as z from "zod";

export const StubResponseSchema = z.object({
	next: z.number().nullable(),
	items: z.array(
		z.object({
			date_posted: z.iso.datetime(),
		})
	),
});

export type StubResponse = z.infer<typeof StubResponseSchema>;
