import * as z from "zod";
import { GranularityKeySchema } from "./granularity-key.schema";
import { TrendPointSchema } from "./trend-point.schema";

export const TrendSeriesDtoSchema = z.object({
	granularity: GranularityKeySchema,
	points: z.array(TrendPointSchema),
});

export type TrendSeriesDto = z.infer<typeof TrendSeriesDtoSchema>;
