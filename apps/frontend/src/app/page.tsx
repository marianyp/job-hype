import { SearchForm } from "@/components/search-form";
import { Box, Heading, Highlight, Stack } from "@chakra-ui/react";
import { JSX } from "react";

export default function Page(): JSX.Element {
	return (
		<Box
			width="full"
			height="full"
			flex="1"
			display="flex"
			justifyContent="center"
			alignItems="center"
			px={{ base: 0, lg: 0 }}
		>
			<Stack
				width={{ base: "full", lg: "5xl" }}
				direction={{ base: "column", lg: "row" }}
				gap={{ base: 8, lg: 0 }}
				outlineColor="whiteAlpha.300"
				outlineStyle="solid"
				outlineWidth="thin"
				padding={{ base: 6, lg: 16 }}
				rounded="xl"
			>
				<Box maxW="md">
					<Heading size="4xl" fontWeight="bold" flex="1">
						<Highlight
							query={["trending"]}
							styles={{
								padding: "1",
								rounded: "sm",
								backgroundColor: "blue.solid",
							}}
						>
							Discover what jobs are trending right now.
						</Highlight>
					</Heading>
				</Box>

				<Box flex="1" display="flex" alignItems="center" minW={0}>
					<Box w="full">
						<SearchForm />
					</Box>
				</Box>
			</Stack>
		</Box>
	);
}
