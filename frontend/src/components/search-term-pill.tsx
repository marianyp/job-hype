import { Box, Circle, HStack, Text, VStack } from "@chakra-ui/react";
import { JSX } from "react";

export type SearchTermPillProps = {
	term: string;
};

export default function SearchTermPill({
	term,
}: SearchTermPillProps): JSX.Element {
	return (
		<Box
			width="fit-content"
			px={6}
			py={4}
			background="gray.800"
			borderRadius="2xl"
		>
			<HStack align="center" gap={4}>
				<Circle size="14px" background="blue.solid" flexShrink="0" />

				<VStack align="start" gap={1}>
					<Text fontWeight="medium" fontSize="lg" lineHeight="1.2">
						{term}
					</Text>

					<Text fontSize="sm" color="gray.300" lineHeight="1">
						Search term
					</Text>
				</VStack>
			</HStack>
		</Box>
	);
}
