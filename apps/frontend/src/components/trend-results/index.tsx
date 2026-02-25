"use client";

import createClient from "@/lib/client";
import {
	Box,
	Heading,
	HTMLChakraProps,
	Spinner,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { GranularityKey, TrendSeriesDto } from "@job-hype/shared";
import { JSX, useEffect, useMemo, useRef, useState } from "react";
import DownloadElementButton from "../download-element-button";
import DownloadJsonButton from "../download-json-button";
import SearchTermPill from "../search-term-pill";
import ShareButton from "../share-button";
import Summary from "../summary/summary";
import TrendSeriesChart from "../trend-series-chart";

type ContainerProps = Omit<HTMLChakraProps<"div">, "direction">;

export type TrendResultsProps = { query: string; granularity: GranularityKey };

export default function TrendResults({
	granularity,
	query,
}: TrendResultsProps): JSX.Element {
	const [trendSeries, setTrendSeries] = useState<TrendSeriesDto | null>(null);
	const chartContainerRef = useRef<HTMLDivElement | null>(null);

	const missingData = useMemo(() => {
		if (trendSeries === null || trendSeries.points.length <= 0) {
			return true;
		}

		return trendSeries.points.every(point => point.index === 0);
	}, [trendSeries]);

	useEffect(() => {
		queueMicrotask(() => setTrendSeries(null));

		const controller = new AbortController();

		createClient()
			.getTrends({ granularity, query }, { signal: controller.signal })
			.then(setTrendSeries)
			.catch(error => {
				setTrendSeries(null);

				if (!(error instanceof DOMException) || error.name !== "AbortError") {
					console.error(error);
				}
			});

		return () => controller.abort();
	}, [granularity, query]);

	const containerProps = useMemo<ContainerProps>(
		() => ({
			outlineColor: "whiteAlpha.300",
			outlineStyle: "solid",
			outlineWidth: "thin",
			padding: "8",
			rounded: "xl",
		}),
		[]
	);

	if (trendSeries === null) {
		return (
			<Box
				width="full"
				height="full"
				flex="1"
				display="flex"
				justifyContent="center"
				alignItems="center"
			>
				<Spinner />
			</Box>
		);
	}

	if (missingData) {
		return (
			<Box {...containerProps}>
				<Text fontWeight="bold">
					No data available for query &apos;{query}&apos;. Try again later.
				</Text>
			</Box>
		);
	}

	const weekText = "Past week";
	const monthText = "Past month";

	const granularityText =
		granularity === GranularityKey.Week ? weekText : monthText;

	return (
		<VStack align="stretch" width="full" height="full" gap="12">
			<VStack align="stretch" gap="4">
				<VStack
					{...containerProps}
					ref={chartContainerRef}
					align="stretch"
					gap="12"
					style={{
						background:
							"radial-gradient(55% 55%, rgb(25, 25, 25) 0%, rgb(10, 10, 10) 100%)",
					}}
				>
					<Stack
						direction={{ base: "column", md: "row" }}
						align={{ base: "stretch", md: "center" }}
						justify={{ base: "flex-start", md: "space-between" }}
						gap={{ base: 4, md: 0 }}
					>
						<VStack align="stretch" gap="1">
							<Heading as="h2" size="xl" fontWeight="medium">
								Job post activity over time
							</Heading>

							<Heading as="h3" size="sm" fontWeight="normal">
								{granularityText}
							</Heading>
						</VStack>

						<Box alignSelf={{ base: "flex-end", md: "auto" }}>
							<SearchTermPill term={query} />
						</Box>
					</Stack>

					<TrendSeriesChart points={trendSeries.points} />
				</VStack>

				<Stack
					direction={{ base: "column", md: "row" }}
					align={{ base: "stretch", md: "center" }}
					justify={{ base: "flex-start", md: "space-between" }}
					gap={{ base: 3, md: 0 }}
					width="full"
				>
					<Box width={{ base: "full", md: "auto" }}>
						<ShareButton
							colorPalette="black"
							query={query}
							width={{ base: "full", md: "auto" }}
						>
							Share
						</ShareButton>
					</Box>

					<Stack
						direction={{ base: "column", md: "row" }}
						gap="2"
						width={{ base: "full", md: "auto" }}
					>
						<Box width={{ base: "full", md: "auto" }}>
							<DownloadElementButton
								colorPalette="blue"
								elementRef={chartContainerRef}
								fileName={query}
								width={{ base: "full", md: "auto" }}
							>
								Download Chart
							</DownloadElementButton>
						</Box>

						<Box width={{ base: "full", md: "auto" }}>
							<DownloadJsonButton
								data={trendSeries}
								fileName={query}
								width={{ base: "full", md: "auto" }}
							>
								Download Raw Data
							</DownloadJsonButton>
						</Box>
					</Stack>
				</Stack>
			</VStack>

			<Box {...containerProps} marginBottom="12">
				<Summary trendSeries={trendSeries} />
			</Box>
		</VStack>
	);
}
