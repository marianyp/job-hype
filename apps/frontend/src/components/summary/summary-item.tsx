import SummaryType from "@/lib/summary/summary-type";
import { HStack, List, Text } from "@chakra-ui/react";
import { CheckCircle, Info, XCircle } from "phosphor-react";
import { JSX, useMemo } from "react";

export type SummaryItemProps = {
	label: string;
	value: string;
	type: SummaryType;
};

export default function SummaryItem({
	label,
	type,
	value,
}: SummaryItemProps): JSX.Element {
	const indicatorMapping = useMemo(
		() => ({
			[SummaryType.Negative]: (
				<List.Indicator asChild color="red.500">
					<XCircle weight="bold" />
				</List.Indicator>
			),
			[SummaryType.Positive]: (
				<List.Indicator asChild color="green.500">
					<CheckCircle weight="bold" />
				</List.Indicator>
			),
			[SummaryType.Informational]: (
				<List.Indicator asChild color="blue.500">
					<Info weight="bold" />
				</List.Indicator>
			),
		}),
		[]
	);

	const indicatorIcon = indicatorMapping[type];

	return (
		<List.Item listStyleType="none">
			<HStack>
				{indicatorIcon}
				<Text color="gray.200">
					<Text display="inline-block" fontWeight="bold">
						{label}:
					</Text>{" "}
					{value}
				</Text>
			</HStack>
		</List.Item>
	);
}
