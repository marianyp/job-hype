import { TrendPoint, TrendSeriesDto, TrendSeriesInput } from "@job-hype/shared";
import { Inject, Injectable } from "@nestjs/common";
import { DateTime } from "luxon";
import { DateService } from "src/date/date.service";
import { Granularity } from "src/granularity/granularity";
import { GranularityRegistry } from "src/granularity/granularity.registry";
import { JobClient } from "src/job-client/job-client";
import { JOB_CLIENTS } from "src/job-client/job-client.tokens";
import { Job } from "./job";
import { JobQuery } from "./job-query";

@Injectable()
export class JobService {
	public constructor(
		@Inject(JOB_CLIENTS) private readonly clients: JobClient[],
		private readonly granularityRegistry: GranularityRegistry,
		private readonly dateService: DateService
	) {}

	public async fetchAndGetTrendSeries(
		input: TrendSeriesInput
	): Promise<TrendSeriesDto> {
		const { granularity: granularityKey, query } = input;

		const originDate = this.dateService.getDate();

		const jobQuery = new JobQuery(query);
		const granularity = this.granularityRegistry.get(granularityKey);

		const providerResults = await Promise.allSettled(
			this.clients.map(provider => provider.fetchJobs(jobQuery))
		);

		const fulfilledResults = providerResults.filter(
			result => result.status === "fulfilled"
		);

		const jobBatches = fulfilledResults.map(result => result.value);

		return JobService.getTrendSeries(jobBatches, granularity, originDate);
	}

	public static getTrendSeries(
		jobBatches: Job[][],
		granularity: Granularity,
		originDate: DateTime
	): TrendSeriesDto {
		const completeCountMap = jobBatches
			.map(jobs => this.countByBucket(jobs, granularity, originDate))
			.map(countMap => this.withAllBuckets(countMap, granularity, originDate));

		const points = this.getTrendPoints(
			completeCountMap,
			granularity,
			originDate
		);

		const normalizedPoints = this.normalizePoints(points);

		return {
			granularity: granularity.getKey(),
			points: normalizedPoints,
		};
	}

	private static getTrendPoints(
		countMaps: Map<string, number>[],
		granularity: Granularity,
		originDate: DateTime
	): TrendPoint[] {
		return granularity
			.getValues(originDate)
			.map(bucket => this.getTrendPoint(bucket, countMaps));
	}

	private static getTrendPoint(
		bucket: string,
		countMaps: Map<string, number>[]
	): TrendPoint {
		const index = countMaps
			.map(counts => counts.get(bucket) ?? 0)
			.reduce((maxValue, currentValue) => Math.max(maxValue, currentValue), 0);

		return {
			bucket,
			index,
		};
	}

	private static normalizePoints(points: TrendPoint[]): TrendPoint[] {
		return this.mapIndicesToPercentOfMean(points);
	}

	public static mapIndicesToPercentOfMean(points: TrendPoint[]): TrendPoint[] {
		const values = points.map(point => point.index);

		const sampleCount = Math.max(values.length, 1);

		const mean =
			values.reduce((sum, value) => sum + value, 0) / sampleCount || 1;

		return points.map(point => {
			const index = Math.round((point.index / mean) * 100);

			return {
				bucket: point.bucket,
				index,
			};
		});
	}

	public static countByBucket(
		jobs: Job[],
		granularity: Granularity,
		originDate: DateTime
	): Map<string, number> {
		const counts = new Map<string, number>();

		for (const job of jobs) {
			const bucket = granularity.getValue(job.postedDate, originDate);

			if (bucket !== null) {
				counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
			}
		}

		return counts;
	}

	public static withAllBuckets(
		counts: Map<string, number>,
		granularity: Granularity,
		originDate: DateTime
	): Map<string, number> {
		const map = new Map<string, number>();
		const buckets = granularity.getValues(originDate);

		for (const bucket of buckets) {
			map.set(bucket, counts.get(bucket) ?? 0);
		}

		return map;
	}
}
