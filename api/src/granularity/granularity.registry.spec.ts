import { GranularityKey } from "@job-hype/shared";
import { Test, TestingModule } from "@nestjs/testing";
import testImports from "src/test/test.imports";
import { GranularityModule } from "./granularity.module";
import { GranularityRegistry } from "./granularity.registry";

describe("GranularityRegistry", () => {
	let registry: GranularityRegistry;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [...testImports, GranularityModule],
		}).compile();

		registry = module.get(GranularityRegistry);
	});

	it("should be defined", () => {
		expect(registry).toBeDefined();
	});

	it("should contain all granularities", () => {
		Object.values(GranularityKey).forEach(key => {
			expect(registry.get(key)).toBeDefined();
		});
	});
});
