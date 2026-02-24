import formatters from "@/lib/summary/formatter";
import TrendSeriesSummary from "@/lib/summary/trend-series-summary";
import { Heading, List, VStack } from "@chakra-ui/react";
import { TrendSeriesDto } from "@job-hype/shared";
import { JSX, useMemo } from "react";
import SummaryItem from "./summary-item";

export type NotesProps = { trendSeries: TrendSeriesDto };

export default function Summary({ trendSeries }: NotesProps): JSX.Element {
	const items = useMemo(() => {
		const formatter = new TrendSeriesSummary({
			trendSeries,
			formatters: Object.values(formatters),
		});

		return formatter.map((value, type, index) => (
			<SummaryItem key={`summary-item-${index}`} value={value} type={type} />
		));
	}, [trendSeries]);

	return (
		<VStack align="stretch">
			<Heading as="h3" size="xl" fontWeight="medium">
				Summary
			</Heading>

			<List.Root gap="1.5">{items}</List.Root>
		</VStack>
	);
}
