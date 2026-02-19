import { Module } from "@nestjs/common";
import { GranularityModule } from "src/granularity/granularity.module";
import { JobsSourceModule } from "src/job-client/job-client.module";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";

@Module({
	imports: [GranularityModule, JobsSourceModule],
	controllers: [JobController],
	providers: [JobService],
})
export class JobModule {}
