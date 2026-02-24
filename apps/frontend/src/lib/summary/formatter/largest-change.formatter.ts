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

	public override getLabel(): string {
		return `Largest change between day(s)`;
	}

	public override getValue(summary: TrendSeriesSummary): string | null {
		const biggestJump =
			LargestChangeFormatter.getLargestConsecutiveChange(summary);

		if (biggestJump === null) {
			return null;
		}

		const { delta, from, to } = biggestJump;

		const formattedDelta = LargestChangeFormatter.formatDelta(delta);

		const normalizedFrom = SummaryFormatter.normalizeBucket(from);
		const normalizedTo = SummaryFormatter.normalizeBucket(to);

		return `${normalizedFrom} to ${normalizedTo} (${formattedDelta} points)`;
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
