import { GranularityKey, TrendPoint } from "@job-hype/shared";
import { Test, TestingModule } from "@nestjs/testing";
import { GranularityModule } from "src/granularity/granularity.module";
import { MonthGranularity } from "src/granularity/month.granularity";
import { WeekGranularity } from "src/granularity/week.granularity";
import { JobsSourceModule } from "src/job-client/job-client.module";
import { dateAtUtcNoon } from "src/test/test.helpers";
import testImports from "src/test/test.imports";
import { Job } from "./job";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";

describe("JobService", () => {
	let service: JobService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [...testImports, GranularityModule, JobsSourceModule],
			controllers: [JobController],
			providers: [JobService],
		}).compile();

		service = module.get(JobService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("getTrendSeries", () => {
		it("countByBucket should have correct granularity key (month granularity)", () => {
			const granularity = new MonthGranularity();
			const result = JobService.getTrendSeries([], granularity, new Date());

			expect(result.granularity).toBe(GranularityKey.Month);
		});

		it("countByBucket should have correct granularity key (week granularity)", () => {
			const granularity = new WeekGranularity();
			const result = JobService.getTrendSeries([], granularity, new Date());

			expect(result.granularity).toBe(GranularityKey.Week);
		});

		it("should return all buckets (month granularity)", () => {
			const granularity = new MonthGranularity();
			const result = JobService.getTrendSeries([], granularity, new Date());

			expect(result.points).toHaveLength(30);
		});

		it("should return all buckets (week granularity)", () => {
			const granularity = new WeekGranularity();
			const result = JobService.getTrendSeries([], granularity, new Date());

			expect(result.points).toHaveLength(7);
		});

		it("should return an empty trend series when there's no jobs (month granularity)", () => {
			const granularity = new MonthGranularity();
			const result = JobService.getTrendSeries([], granularity, new Date());

			expect(result.points.every(point => point.index === 0)).toBe(true);
		});

		it("should return an empty trend series when there's no jobs (week granularity)", () => {
			const granularity = new WeekGranularity();
			const result = JobService.getTrendSeries([], granularity, new Date());

			expect(result.points.every(point => point.index === 0)).toBe(true);
		});

		it("should calculate normalized trend series (month granularity)", () => {
			const granularity = new MonthGranularity();

			const batches = [
				[
					new Job(dateAtUtcNoon(1, 24, 2026)),
					new Job(dateAtUtcNoon(2, 12, 2026)),
					new Job(dateAtUtcNoon(2, 12, 2026)),
				],
			];

			const result = JobService.getTrendSeries(
				batches,
				granularity,
				dateAtUtcNoon(2, 13, 2026)
			);

			const buckets = Object.fromEntries(
				result.points.map(point => [point.bucket, point.index])
			);

			expect(buckets["january 24th"]).toBe(1000);
			expect(buckets["february 12th"]).toBe(2000);

			expect(buckets["february 2nd"]).toBe(0);
		});

		it("should calculate normalized trend series (week granularity)", () => {
			const granularity = new WeekGranularity();

			const batches = [
				[
					new Job(dateAtUtcNoon(2, 10, 2026)),
					new Job(dateAtUtcNoon(2, 12, 2026)),
					new Job(dateAtUtcNoon(2, 12, 2026)),
				],
			];

			const result = JobService.getTrendSeries(
				batches,
				granularity,
				dateAtUtcNoon(2, 13, 2026)
			);

			const buckets = Object.fromEntries(
				result.points.map(point => [point.bucket, point.index])
			);

			expect(buckets["thursday"]).toBe(467);
			expect(buckets["tuesday"]).toBe(233);

			expect(buckets["wednesday"]).toBe(0);
		});

		it("should aggregate across multiple batches (month granularity)", () => {
			const granularity = new MonthGranularity();

			const batches = [
				[new Job(dateAtUtcNoon(2, 12, 2026))],
				[
					new Job(dateAtUtcNoon(2, 12, 2026)),
					new Job(dateAtUtcNoon(2, 12, 2026)),
				],
			];

			const result = JobService.getTrendSeries(
				batches,
				granularity,
				dateAtUtcNoon(2, 13, 2026)
			);

			const buckets = Object.fromEntries(
				result.points.map(point => [point.bucket, point.index])
			);

			expect(buckets["february 12th"]).toBe(3000);
		});

		it("should aggregate across multiple batches (week granularity)", () => {
			const granularity = new WeekGranularity();

			const batches = [
				[new Job(dateAtUtcNoon(2, 12, 2026))],
				[
					new Job(dateAtUtcNoon(2, 12, 2026)),
					new Job(dateAtUtcNoon(2, 12, 2026)),
				],
			];

			const result = JobService.getTrendSeries(
				batches,
				granularity,
				dateAtUtcNoon(2, 13, 2026)
			);

			const buckets = Object.fromEntries(
				result.points.map(point => [point.bucket, point.index])
			);

			expect(buckets["thursday"]).toBe(700);
		});
	});

	describe("countByBucket", () => {
		it("should ignore jobs whose bucket resolves to null (month granularity)", () => {
			const granularity = new MonthGranularity();

			const jobs: Job[] = [
				new Job(dateAtUtcNoon(3, 1, 2026)),
				new Job(dateAtUtcNoon(2, 1, 2026)),
				new Job(dateAtUtcNoon(2, 1, 2026)),
			];

			const result = JobService.countByBucket(
				jobs,
				granularity,
				dateAtUtcNoon(2, 2, 2026)
			);

			expect(result.get("february 1st")).toBe(2);
			expect(result.has("null")).toBe(false);
			expect(result.size).toBe(1);
		});

		it("should ignore jobs whose bucket resolves to null (week granularity)", () => {
			const granularity = new WeekGranularity();

			const jobs: Job[] = [
				new Job(dateAtUtcNoon(1, 25, 2026)),
				new Job(dateAtUtcNoon(2, 1, 2026)),
				new Job(dateAtUtcNoon(2, 1, 2026)),
			];

			const result = JobService.countByBucket(
				jobs,
				granularity,
				dateAtUtcNoon(2, 2, 2026)
			);

			expect(result.get("sunday")).toBe(2);
			expect(result.has("null")).toBe(false);
			expect(result.size).toBe(1);
		});
	});

	describe("withAllBuckets", () => {
		it("should include every bucket from granularity values and default missing ones to zero (month granularity)", () => {
			const counts = new Map<string, number>([
				["january 1st", 2],
				["january 2nd", 5],
			]);

			const granularity = new MonthGranularity();

			const result = JobService.withAllBuckets(
				counts,
				granularity,
				dateAtUtcNoon(1, 31, 2026)
			);

			expect(result.get("january 1st")).toBe(2);
			expect(result.get("january 2nd")).toBe(5);

			expect(result.get("january 3rd")).toBe(0);

			expect(Array.from(result.keys())).toEqual([
				"january 1st",
				"january 2nd",
				"january 3rd",
				"january 4th",
				"january 5th",
				"january 6th",
				"january 7th",
				"january 8th",
				"january 9th",
				"january 10th",
				"january 11th",
				"january 12th",
				"january 13th",
				"january 14th",
				"january 15th",
				"january 16th",
				"january 17th",
				"january 18th",
				"january 19th",
				"january 20th",
				"january 21st",
				"january 22nd",
				"january 23rd",
				"january 24th",
				"january 25th",
				"january 26th",
				"january 27th",
				"january 28th",
				"january 29th",
				"january 30th",
			]);
		});

		it("should include every bucket from granularity values and default missing ones to zero (week granularity)", () => {
			const counts = new Map<string, number>([
				["monday", 2],
				["tuesday", 5],
			]);

			const granularity = new WeekGranularity();

			const result = JobService.withAllBuckets(
				counts,
				granularity,
				dateAtUtcNoon(2, 8, 2026)
			);

			expect(result.get("monday")).toBe(2);
			expect(result.get("tuesday")).toBe(5);

			expect(result.get("wednesday")).toBe(0);

			expect(Array.from(result.keys())).toEqual([
				"sunday",
				"monday",
				"tuesday",
				"wednesday",
				"thursday",
				"friday",
				"saturday",
			]);
		});
	});

	describe("mapIndicesToPercentOfMean", () => {
		it("should avoid producing NaN and Infinity indices when mean is zero and return 0 indices", () => {
			const points: TrendPoint[] = [
				{ bucket: "monday", index: 0 },
				{ bucket: "tuesday", index: 0 },
				{ bucket: "wednesday", index: 0 },
				{ bucket: "thursday", index: 0 },
				{ bucket: "friday", index: 0 },
			];

			const result = JobService.mapIndicesToPercentOfMean(points);

			expect(result).toEqual([
				{ bucket: "monday", index: 0 },
				{ bucket: "tuesday", index: 0 },
				{ bucket: "wednesday", index: 0 },
				{ bucket: "thursday", index: 0 },
				{ bucket: "friday", index: 0 },
			]);
		});
	});
});
