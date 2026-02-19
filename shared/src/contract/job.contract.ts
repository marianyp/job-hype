import { oc, populateContractRouterPaths } from "@orpc/contract";
import { TrendSeriesDtoSchema } from "../schema/trend-series-dto.schema";
import { TrendSeriesInputSchema } from "../schema/trend-series-input.schema";

export const jobContract = populateContractRouterPaths({
	job: {
		trendSeries: oc
			.route({ method: "GET" })
			.input(TrendSeriesInputSchema)
			.output(TrendSeriesDtoSchema),
	},
});
