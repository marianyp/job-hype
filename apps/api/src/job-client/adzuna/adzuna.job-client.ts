import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "src/config/env.schema";
import { Job } from "src/job/job";
import { JobQuery } from "src/job/job-query";
import { ThrottledTaskScheduler } from "src/task-scheduler/throttled-task-scheduler";
import {
	JobClient,
	JobClientRequestParams,
	JobClientResponseSchema,
} from "../job-client";
import { AdzunaResponse, AdzunaResponseSchema } from "./adzuna.schemas";

@Injectable()
export class AdzunaJobClient extends JobClient<AdzunaResponse> {
	public constructor(
		private readonly configService: ConfigService<Env>,
		http: HttpService
	) {
		super(
			http,
			new Logger(AdzunaJobClient.name),
			new ThrottledTaskScheduler(25, 60_000)
		);
	}

	protected override buildUrl(): string {
		return this.configService.getOrThrow("ADZUNA_BASE_URL", { infer: true });
	}

	protected override buildParams(query: JobQuery): JobClientRequestParams {
		const appId = this.configService.getOrThrow("ADZUNA_APP_ID", {
			infer: true,
		});

		const appKey = this.configService.getOrThrow("ADZUNA_APP_KEY", {
			infer: true,
		});

		return {
			app_id: appId,
			app_key: appKey,
			what: query.title,
		};
	}

	protected override getResponseSchema(): JobClientResponseSchema<AdzunaResponse> {
		return AdzunaResponseSchema;
	}

	protected override mapJobs(response: AdzunaResponse): Job[] {
		return response.results.map(result => new Job(result.created));
	}
}
