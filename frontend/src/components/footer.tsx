import { Box, Text } from "@chakra-ui/react";
import { JSX } from "react";

export default function Footer(): JSX.Element {
	const year = new Date().getFullYear();

	return (
		<Box
			as="footer"
			width="full"
			py={6}
			borderTopWidth="thin"
			borderColor="whiteAlpha.300"
		>
			<Text marginLeft="12" fontSize="sm" color="gray.600">
				&#169; {year} JobHype. All rights reserved.
			</Text>
		</Box>
	);
}
