import SummaryType from "../summary-type";
import TrendSeriesSummary from "../trend-series-summary";

export default abstract class SummaryFormatter {
	public constructor(protected readonly type: SummaryType) {}

	public getType(): SummaryType {
		return this.type;
	}

	public abstract compute(summary: TrendSeriesSummary): string | null;

	public static formatAverage(index: number): string {
		if (index === 0) {
			return `Insufficient data`;
		}

		const difference = index - 100;
		const magnitude = Math.abs(difference);

		if (difference > 0) {
			return `${magnitude}% above average`;
		} else {
			return `${magnitude}% below average`;
		}
	}

	public static normalizeBucket(bucket: string): string {
		return SummaryFormatter.capitalizeFirstLetter(bucket);
	}

	protected static normalizeBuckets(buckets: string[]): string {
		const firstBucket = buckets[0];

		if (firstBucket === undefined) {
			return "";
		}

		const normalizedFirstBucket = this.normalizeBucket(firstBucket);

		const secondBucket = buckets[1];

		if (secondBucket === undefined) {
			return normalizedFirstBucket;
		}

		const normalizedSecondBucket = this.normalizeBucket(secondBucket);

		if (buckets.length === 2) {
			return `${normalizedFirstBucket} and ${normalizedSecondBucket}`;
		}

		const normalizedBuckets = buckets.map(value =>
			SummaryFormatter.normalizeBucket(value)
		);

		const leadingBuckets = normalizedBuckets.slice(0, -1).join(", ");

		const lastNormalizedBucket =
			normalizedBuckets[normalizedBuckets.length - 1];

		return `${leadingBuckets}, and ${lastNormalizedBucket}`;
	}

	private static capitalizeFirstLetter(string: string): string {
		if (string.length === 0) {
			return "";
		}

		const firstLetter = string.charAt(0).toUpperCase();
		const restOfString = string.slice(1);

		return firstLetter + restOfString;
	}

	protected static pluralize(
		value: number,
		singular: string,
		plural = singular + "s"
	): string {
		return value === 1 ? singular : plural;
	}
}
