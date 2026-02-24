import SummaryType from "../summary-type";
import TrendSeriesSummary from "../trend-series-summary";
import SummaryFormatter from "./summary-formatter";

type BiggestConsecutiveJumpResult = {
	from: string;
	to: string;
	delta: number;
} | null;

export default class LargestChangeFormatter extends SummaryFormatter {
	public constructor() {
		super(SummaryType.Informational);
	}

	public compute(summary: TrendSeriesSummary): string | null {
		const biggestJump =
			LargestChangeFormatter.getLargestConsecutiveChange(summary);

		if (biggestJump === null) {
			return null;
		}

		const { delta, from, to } = biggestJump;

		const unit = summary.unitName();

		const pluralizedUnit = SummaryFormatter.pluralize(2, unit);

		const formattedDelta = LargestChangeFormatter.formatDelta(delta);

		const normalizedFrom = SummaryFormatter.normalizeBucket(from);
		const normalizedTo = SummaryFormatter.normalizeBucket(to);

		return `Largest change between consecutive ${pluralizedUnit}: ${normalizedFrom} to ${normalizedTo} (${formattedDelta} points).`;
	}

	private static getLargestConsecutiveChange(
		summary: TrendSeriesSummary
	): BiggestConsecutiveJumpResult {
		const points = summary.getPoints();

		if (points.length < 2) {
			return null;
		}

		let best: BiggestConsecutiveJumpResult = null;

		for (let i = 1; i < points.length; i++) {
			const previousPoint = points[i - 1];
			const point = points[i];

			if (previousPoint !== undefined && point !== undefined) {
				const delta = point.index - previousPoint.index;

				if (!best || Math.abs(delta) > Math.abs(best.delta)) {
					best = { from: previousPoint.bucket, to: point.bucket, delta };
				}
			}
		}

		return best;
	}

	private static formatDelta(delta: number): string {
		const sign = delta >= 0 ? "+" : "";
		return `${sign}${delta}`;
	}
}
