import SummaryType from "../summary-type";
import TrendSeriesSummary from "../trend-series-summary";
import SummaryFormatter from "./summary-formatter";

export default class MostActiveFormatter extends SummaryFormatter {
	public constructor() {
		super(SummaryType.Positive);
	}

	public override getLabel(summary: TrendSeriesSummary): string | null {
		const unit = summary.unitName();
		const buckets = MostActiveFormatter.getMostProductiveBuckets(summary);
		const pluralizedBuckets = SummaryFormatter.pluralize(buckets.length, unit);

		return `Most active ${pluralizedBuckets}`;
	}

	public override getValue(summary: TrendSeriesSummary): string {
		const buckets = MostActiveFormatter.getMostProductiveBuckets(summary);
		const normalizedBuckets = SummaryFormatter.normalizeBuckets(buckets);

		return normalizedBuckets;
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
