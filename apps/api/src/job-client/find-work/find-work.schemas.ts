import * as z from "zod";

export const FindWorkResponseSchema = z.object({
	next: z.url().nullable(),
	results: z.array(
		z.object({
			date_posted: z.iso.datetime(),
		})
	),
});

export type FindWorkResponse = z.infer<typeof FindWorkResponseSchema>;
