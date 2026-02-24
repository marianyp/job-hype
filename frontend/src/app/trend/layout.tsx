import { SearchForm } from "@/components/search-form";
import { Box } from "@chakra-ui/react";
import { JSX, PropsWithChildren } from "react";

export default function TrendLayout({
	children,
}: PropsWithChildren): JSX.Element {
	return (
		<>
			<Box w="full" marginY="12">
				<SearchForm />
			</Box>

			{children}
		</>
	);
}
