import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "src/config/env.schema";
import { Job } from "src/job/job";
import { JobQuery } from "src/job/job-query";
import {
	JobClient,
	JobClientRequestHeaders,
	JobClientRequestParams,
	JobClientResponseSchema,
} from "../job-client";
import { FindWorkResponse, FindWorkResponseSchema } from "./find-work.schemas";

@Injectable()
export class FindworkJobClient extends JobClient<FindWorkResponse> {
	public constructor(
		private readonly config: ConfigService<Env>,
		http: HttpService
	) {
		super(http, new Logger(FindworkJobClient.name));
	}

	protected override buildUrl(): string {
		return this.config.getOrThrow("FINDWORK_BASE_URL", { infer: true });
	}

	protected override buildParams(
		query: JobQuery,
		page: number
	): JobClientRequestParams {
		return { format: "json", search: query.title, page };
	}

	protected override buildHeaders(): JobClientRequestHeaders {
		const token = this.config.getOrThrow("FINDWORK_API_KEY", { infer: true });
		return { Authorization: `Token ${token}` };
	}

	protected override getResponseSchema(): JobClientResponseSchema<FindWorkResponse> {
		return FindWorkResponseSchema;
	}

	protected override mapJobs(response: FindWorkResponse): Job[] {
		return response.results.map(
			result => new Job(new Date(result.date_posted))
		);
	}

	protected override getNextPage(response: FindWorkResponse): number | null {
		const nextUrl = response.next;

		if (nextUrl === null) {
			return null;
		}

		const url = new URL(nextUrl);
		const nextPage = url.searchParams.get("page");

		if (nextPage === null) {
			return null;
		}

		return Number(nextPage);
	}
}
