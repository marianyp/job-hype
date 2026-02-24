import * as z from "zod";
import { GranularityKeySchema } from "./granularity-key.schema";

export const TrendSeriesInputSchema = z.object({
	query: z.string(),
	granularity: GranularityKeySchema,
});

export type TrendSeriesInput = z.infer<typeof TrendSeriesInputSchema>;
