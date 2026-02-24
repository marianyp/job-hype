import { HttpService } from "@nestjs/axios";
import type { Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { Job } from "src/job/job";
import { JobQuery } from "src/job/job-query";
import { TestTaskScheduler } from "src/task-scheduler/test-task-scheduler";
import {
	JobClient,
	JobClientRequestParams,
	JobClientResponseSchema,
} from "../job-client";
import { StubResponse, StubResponseSchema } from "./stub.schemas";

@Injectable()
export class StubJobClient extends JobClient<StubResponse> {
	public constructor(http: HttpService, logger: Logger) {
		super(http, logger, new TestTaskScheduler());
	}

	protected override buildUrl(): string {
		return "https://example.com/jobs";
	}

	protected override buildParams(
		query: JobQuery,
		page: number
	): JobClientRequestParams {
		return { search: query.title, page };
	}

	protected override getResponseSchema(): JobClientResponseSchema<StubResponse> {
		return StubResponseSchema;
	}

	protected override mapJobs(response: StubResponse): Job[] {
		return response.items.map(result => new Job(result.date_posted));
	}

	protected override getNextPage(response: StubResponse): number | null {
		return response.next;
	}
}
