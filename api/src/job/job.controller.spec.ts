import { Test, TestingModule } from "@nestjs/testing";
import { GranularityModule } from "src/granularity/granularity.module";
import { JobsSourceModule } from "src/job-client/job-client.module";
import testImports from "src/test/test.imports";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";

describe("JobController", () => {
	let controller: JobController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [...testImports, GranularityModule, JobsSourceModule],
			controllers: [JobController],
			providers: [JobService],
		}).compile();

		controller = module.get<JobController>(JobController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
