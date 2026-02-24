import * as z from "zod";

export const TrendPointSchema = z.object({
	bucket: z.string(),
	index: z.number().int(),
});

export type TrendPoint = z.infer<typeof TrendPointSchema>;
