"use client";

import ClientTrendResults from "@/components/trend-results/client-trend-results";
import { Loader } from "@chakra-ui/react";
import { JSX, Suspense } from "react";

export default function Page(): JSX.Element {
	return (
		<Suspense fallback={<Loader />}>
			<ClientTrendResults />
		</Suspense>
	);
}
