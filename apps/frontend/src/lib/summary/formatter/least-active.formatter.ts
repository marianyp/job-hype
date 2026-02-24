import SummaryType from "../summary-type";
import TrendSeriesSummary from "../trend-series-summary";
import SummaryFormatter from "./summary-formatter";

export default class LeastActiveFormatter extends SummaryFormatter {
	public constructor() {
		super(SummaryType.Negative);
	}

	public override getLabel(summary: TrendSeriesSummary): string | null {
		const unit = summary.unitName();
		const buckets = LeastActiveFormatter.getLeastProductiveBuckets(summary);
		const pluralizedBuckets = SummaryFormatter.pluralize(buckets.length, unit);

		return `Least active ${pluralizedBuckets}`;
	}

	public override getValue(summary: TrendSeriesSummary): string {
		const buckets = LeastActiveFormatter.getLeastProductiveBuckets(summary);
		const normalizedBuckets = SummaryFormatter.normalizeBuckets(buckets);

		return normalizedBuckets;
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
