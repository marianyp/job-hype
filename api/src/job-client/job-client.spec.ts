import { HttpService } from "@nestjs/axios";
import { Logger, LoggerService } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AxiosError } from "axios";
import { of, throwError } from "rxjs";
import { JobQuery } from "src/job/job-query";
import { JobClient } from "./job-client";
import { StubJobClient } from "./stub/stub.job-client";

type Mocks = {
	client: JobClient;
	httpService: jest.Mocked<HttpService>;
	logger: jest.Mocked<LoggerService>;
};

async function getMocks<T, Y extends unknown[], C>(
	mockInstance: jest.MockInstance<T, Y, C>
): Promise<Mocks> {
	const module: TestingModule = await Test.createTestingModule({
		providers: [
			{
				provide: HttpService,
				useValue: {
					get: mockInstance,
				},
			},
			{
				provide: Logger,
				useValue: {
					error: jest.fn().mockImplementation(() => {}),
					warn: jest.fn().mockImplementation(() => {}),
					log: jest.fn().mockImplementation(() => {}),
					debug: jest.fn().mockImplementation(() => {}),
					verbose: jest.fn().mockImplementation(() => {}),
				},
			},
			{
				provide: JobClient,
				useFactory: (httpService: HttpService, logger: Logger) =>
					new StubJobClient(httpService, logger),
				inject: [HttpService, Logger],
			},
		],
	}).compile();

	return {
		client: module.get(JobClient),
		httpService: module.get(HttpService),
		logger: module.get(Logger),
	};
}

describe("JobClient", () => {
	describe("fetchJobs", () => {
		it("should fetch all pages", async () => {
			const { client, httpService } = await getMocks(
				jest
					.fn()
					.mockReturnValueOnce(
						of({
							data: {
								items: [{ date_posted: "2026-02-04T00:00:00.000Z" }],
								next: 2,
							},
						})
					)
					.mockReturnValueOnce(
						of({
							data: {
								items: [{ date_posted: "2026-02-05T00:00:00.000Z" }],
								next: 3,
							},
						})
					)
					.mockReturnValue(
						of({
							data: {
								items: [{ date_posted: "2026-02-05T00:00:00.000Z" }],
								next: null,
							},
						})
					)
			);

			const jobTitle = "software engineer";

			await client.fetchJobs(new JobQuery(jobTitle));

			expect(httpService.get.mockImplementation()).toHaveBeenCalledTimes(3);

			expect(httpService.get.mock.calls[0]?.[1]?.params).toEqual({
				page: 1,
				search: jobTitle,
			});

			expect(httpService.get.mock.calls[1]?.[1]?.params).toEqual({
				page: 2,
				search: jobTitle,
			});
		});

		it("should stop if a page repeats", async () => {
			const { client, httpService, logger } = await getMocks(
				jest
					.fn()
					.mockReturnValueOnce(
						of({
							data: {
								items: [{ date_posted: "2026-02-05T00:00:00.000Z" }],
								next: 1,
							},
						})
					)
					.mockReturnValueOnce(
						of({
							data: {
								items: [{ date_posted: "2026-02-06T00:00:00.000Z" }],
								next: 1,
							},
						})
					)
			);

			const jobs = await client.fetchJobs(new JobQuery("software engineer"));

			expect(jobs.length).toEqual(1);
			expect(logger.warn.mockImplementation()).toHaveBeenCalledTimes(1);
			expect(httpService.get.mockImplementation()).toHaveBeenCalledTimes(1);
		});

		it("should log request failure error", async () => {
			const { client, logger } = await getMocks(
				jest.fn().mockReturnValueOnce(throwError(() => new AxiosError()))
			);

			await client.fetchJobs(new JobQuery("software engineer"));

			expect(logger.error.mockImplementation()).toHaveBeenCalled();
		});

		it("should log response parsing error", async () => {
			const { client, logger } = await getMocks(
				jest.fn().mockReturnValueOnce(of({ data: { wrong: "shape" } }))
			);

			await client.fetchJobs(new JobQuery("software engineer"));

			expect(logger.error.mockImplementation()).toHaveBeenCalled();
		});
	});
});
