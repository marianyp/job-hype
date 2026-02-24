import { GranularityKey, TrendPoint, TrendSeriesDto } from "@job-hype/shared";
import SummaryFormatter from "./formatter/summary-formatter";
import SummaryType from "./summary-type";

export type TrendSeriesSummaryArguments = {
	trendSeries: TrendSeriesDto;
	formatters?: SummaryFormatter[];
};

export type LongestStreakPredicate = (index: number) => boolean;

export type LongestStreakResult = {
	length: number;
	buckets: string[];
};

export type MapCallback<T> = (
	value: string,
	type: SummaryType,
	index: number
) => T;

export default class TrendSeriesSummary {
	private readonly granularity: GranularityKey;
	private readonly points: TrendPoint[];

	private readonly indexes: number[];

	private readonly meanIndex: number;
	private readonly standardDeviationIndex: number;
	private readonly minIndex: number;
	private readonly maxIndex: number;

	private readonly formatters: SummaryFormatter[];

	public constructor({ formatters, trendSeries }: TrendSeriesSummaryArguments) {
		const { granularity, points } = trendSeries;

		this.granularity = granularity;
		this.points = [...(points ?? [])];
		this.indexes = this.points.map(point => point.index);

		this.formatters = formatters ?? [];

		if (this.points.length === 0) {
			this.meanIndex = 0;
			this.standardDeviationIndex = 0;
			this.minIndex = 0;
			this.maxIndex = 0;
		} else {
			this.meanIndex = TrendSeriesSummary.mean(this.indexes);
			this.standardDeviationIndex = TrendSeriesSummary.standardDeviation(
				this.indexes
			);
			this.minIndex = Math.min(...this.indexes);
			this.maxIndex = Math.max(...this.indexes);
		}
	}

	public getGranularity(): GranularityKey {
		return this.granularity;
	}

	public getPoints(): TrendPoint[] {
		return this.points;
	}

	public getIndexes(): number[] {
		return this.indexes;
	}

	public getMeanIndex(): number {
		return this.meanIndex;
	}

	public getStandardDeviationIndex(): number {
		return this.standardDeviationIndex;
	}

	public getMinIndex(): number {
		return this.minIndex;
	}

	public getMaxIndex(): number {
		return this.maxIndex;
	}

	public unitName(): string {
		if (this.granularity === GranularityKey.Week) {
			return "day";
		}

		return "date";
	}

	public map<T>(
		callback: MapCallback<T>,
		orderMapping?: Record<SummaryType, number>
	): T[] {
		if (this.points.length === 0) {
			return [];
		}

		if (orderMapping === undefined) {
			orderMapping = {
				[SummaryType.Positive]: 0,
				[SummaryType.Negative]: 1,
				[SummaryType.Informational]: 2,
			};
		}

		return this.formatters
			.map((formatter, originalIndex) => ({
				type: formatter.getType(),
				value: formatter.compute(this),
				originalIndex,
			}))
			.filter(({ value }) => value !== null)
			.sort((firstValue, secondValue) => {
				const byType =
					orderMapping[firstValue.type] - orderMapping[secondValue.type];

				return byType !== 0
					? byType
					: firstValue.originalIndex - secondValue.originalIndex;
			})
			.map(({ type, value }, index) => {
				if (value === null) {
					throw new TypeError("Expected format result value to be a string");
				}

				return callback(value, type, index);
			});
	}

	private static mean(values: number[]): number {
		return values.reduce((a, b) => a + b, 0) / (values.length || 1);
	}

	private static standardDeviation(values: number[]): number {
		if (values.length <= 1) {
			return 0;
		}

		const mean = TrendSeriesSummary.mean(values);
		const variance = TrendSeriesSummary.mean(values.map(x => (x - mean) ** 2));

		return Math.sqrt(variance);
	}
}
