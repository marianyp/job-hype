import { jobContract, TrendSeriesDto } from "@job-hype/shared";
import { Controller } from "@nestjs/common";
import { implement, Implement } from "@orpc/nest";
import { JobService } from "./job.service";

const trendSeriesImplementer = implement(jobContract.job["trend-series"]);
type TrendSeriesImpl = ReturnType<typeof trendSeriesImplementer.handler>;

@Controller()
export class JobController {
	public constructor(private readonly jobService: JobService) {}

	@Implement(jobContract.job["trend-series"])
	public getTrendSeries(): TrendSeriesImpl {
		return trendSeriesImplementer.handler(
			async ({ input }): Promise<TrendSeriesDto> => {
				return this.jobService.fetchAndGetTrendSeries(input);
			}
		);
	}
}
