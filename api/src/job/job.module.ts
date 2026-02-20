import { Module } from "@nestjs/common";
import { DateModule } from "src/date/date.module";
import { GranularityModule } from "src/granularity/granularity.module";
import { JobsSourceModule } from "src/job-client/job-client.module";
import { TrendSeriesCacheModule } from "src/trend-series-cache/trend-series-cache.module";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";

@Module({
	imports: [
		GranularityModule,
		JobsSourceModule,
		DateModule,
		TrendSeriesCacheModule.register(10_000),
	],
	controllers: [JobController],
	providers: [JobService],
})
export class JobModule {}
