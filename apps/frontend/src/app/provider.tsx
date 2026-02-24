"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { JSX, PropsWithChildren } from "react";

export default function Provider(props: PropsWithChildren): JSX.Element {
	return (
		<ChakraProvider value={defaultSystem}>{props.children}</ChakraProvider>
	);
}
