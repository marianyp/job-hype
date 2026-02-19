import { HttpService } from "@nestjs/axios";
import { LoggerService } from "@nestjs/common";
import axios from "axios";
import { firstValueFrom } from "rxjs";
import { Job } from "src/job/job";
import { JobQuery } from "src/job/job-query";
import { ZodError, ZodType } from "zod";

export type JobClientRequestParams = Record<string, string | number>;
export type JobClientRequestHeaders = Record<string, string | number>;
export type JobClientResponseSchema<T> = ZodType<T>;

export abstract class JobClient<T = unknown> {
	protected constructor(
		protected readonly http: HttpService,
		protected readonly loggerService: LoggerService
	) {}

	public async fetchJobs(query: JobQuery): Promise<Job[]> {
		const jobs: Job[] = [];

		try {
			const seenPages = new Set<number>();
			let page: number | null = 1;

			while (page !== null) {
				if (seenPages.has(page)) {
					this.loggerService.warn(
						`Prematurely stopping job fetching. Attempted to refetch page ${page} with query ${JSON.stringify(query)}`
					);
					break;
				}

				const response = await firstValueFrom(
					this.http.get(this.buildUrl(), {
						params: this.buildParams(query, page),
						headers: this.buildHeaders(),
					})
				);

				const data = this.getResponseSchema().parse(response.data);
				jobs.push(...this.mapJobs(data));

				seenPages.add(page);

				page = this.getNextPage(data);
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const { response, message } = error;

				if (response) {
					this.loggerService.error(
						`Unexpected request error with status code ${response.status} occurred while fetching jobs: ${message}`
					);
				} else {
					this.loggerService.error(
						`Unexpected request error occurred while fetching jobs: ${message}`
					);
				}
			} else if (error instanceof ZodError) {
				this.loggerService.error(
					`Unexpected response shape found while fetching jobs: ${error.message}`
				);
			} else {
				this.loggerService.error(
					`Unexpected error occurred while fetching jobs: ${error}`
				);
			}
		}

		return jobs;
	}

	protected abstract buildUrl(): string;

	protected abstract buildParams(
		query: JobQuery,
		page: number
	): JobClientRequestParams;

	protected buildHeaders(): JobClientRequestHeaders {
		return {};
	}

	protected abstract getResponseSchema(): JobClientResponseSchema<T>;

	protected abstract mapJobs(response: T): Job[];

	protected getNextPage(_response: T): number | null {
		return null;
	}
}
