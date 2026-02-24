import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { AdzunaJobClient } from "./adzuna/adzuna.job-client";
import { FindworkJobClient } from "./find-work/find-work.job-client";
import { JOB_CLIENTS } from "./job-client.tokens";

@Module({
	imports: [HttpModule],
	controllers: [],
	providers: [
		AdzunaJobClient,
		FindworkJobClient,
		{
			provide: JOB_CLIENTS,
			useFactory: (
				adzunaJobsProvider: AdzunaJobClient,
				findWorkJobsProvider: FindworkJobClient
			) => [adzunaJobsProvider, findWorkJobsProvider],
			inject: [AdzunaJobClient, FindworkJobClient],
		},
	],
	exports: [JOB_CLIENTS],
})
export class JobsSourceModule {}
