import * as z from "zod";

export const AdzunaResponseSchema = z.object({
	results: z.array(
		z.object({
			created: z.iso.datetime(),
		})
	),
});

export type AdzunaResponse = z.infer<typeof AdzunaResponseSchema>;
