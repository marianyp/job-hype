import SummaryType from "../summary-type";
import TrendSeriesSummary from "../trend-series-summary";
import SummaryFormatter from "./summary-formatter";

export default class LeastActiveFormatter extends SummaryFormatter {
	public constructor() {
		super(SummaryType.Negative);
	}

	public compute(summary: TrendSeriesSummary): string {
		const unit = summary.unitName();
		const buckets = LeastActiveFormatter.getLeastProductiveBuckets(summary);
		const pluralizedBuckets = SummaryFormatter.pluralize(buckets.length, unit);
		const normalizedBuckets = SummaryFormatter.normalizeBuckets(buckets);

		return `Least active ${pluralizedBuckets}: ${normalizedBuckets}`;
	}

	private static getLeastProductiveBuckets(
		summary: TrendSeriesSummary
	): string[] {
		const minIndex = summary.getMinIndex();
		const points = summary.getPoints();

		const buckets = points
			.filter(point => point.index === minIndex)
			.map(point => point.bucket);

		return buckets;
	}
}
