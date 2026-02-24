import { Test, TestingModule } from "@nestjs/testing";
import testImports from "src/test/test.imports";
import { DateService } from "./date.service";

describe("DateService", () => {
	let service: DateService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [...testImports],
			providers: [DateService],
		}).compile();

		service = module.get<DateService>(DateService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
