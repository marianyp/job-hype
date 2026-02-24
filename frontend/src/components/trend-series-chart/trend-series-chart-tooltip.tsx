import SummaryFormatter from "@/lib/summary/formatter/summary-formatter";
import { Box, Stack, Text } from "@chakra-ui/react";
import { TrendPointSchema } from "@job-hype/shared";
import { JSX } from "react";
import { TooltipContentProps } from "recharts";
import {
	NameType,
	Payload,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";

type TrendSeriesChartTooltipProps = Omit<
	TooltipContentProps<ValueType, NameType>,
	"payload"
> & {
	payload: ReadonlyArray<Payload<ValueType, NameType>>;
};

export default function TrendSeriesChartTooltip({
	active,
	payload,
}: TrendSeriesChartTooltipProps): JSX.Element | null {
	if (!active || payload[0] === undefined) {
		return null;
	}

	const { index, bucket } = TrendPointSchema.parse(payload[0].payload);

	const normalizedBucket = SummaryFormatter.normalizeBucket(bucket);
	const summary = SummaryFormatter.formatAverage(index);

	return (
		<Box
			background="blackAlpha.400"
			border="1px solid"
			borderColor="whiteAlpha.300"
			borderRadius="md"
			px="3"
			py="2"
			boxShadow="lg"
			minW="180px"
		>
			<Stack gap="1">
				<Text fontSize="sm" color="whiteAlpha.800">
					{normalizedBucket}
				</Text>

				<Text fontSize="sm" color="whiteAlpha.700">
					{summary}
				</Text>
			</Stack>
		</Box>
	);
}
