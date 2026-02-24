import SummaryType from "../summary-type";
import TrendSeriesSummary from "../trend-series-summary";
import SummaryFormatter from "./summary-formatter";

export default class MostActiveFormatter extends SummaryFormatter {
	public constructor() {
		super(SummaryType.Positive);
	}

	public compute(summary: TrendSeriesSummary): string {
		const unit = summary.unitName();
		const buckets = MostActiveFormatter.getMostProductiveBuckets(summary);
		const pluralizedBuckets = SummaryFormatter.pluralize(buckets.length, unit);
		const normalizedBuckets = SummaryFormatter.normalizeBuckets(buckets);

		return `Most active ${pluralizedBuckets}: ${normalizedBuckets}`;
	}

	private static getMostProductiveBuckets(
		summary: TrendSeriesSummary
	): string[] {
		const maxIndex = summary.getMaxIndex();
		const points = summary.getPoints();

		const buckets = points
			.filter(point => point.index === maxIndex)
			.map(point => point.bucket);

		return buckets;
	}
}
