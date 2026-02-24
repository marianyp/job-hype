"use client";

import { Chart, useChart } from "@chakra-ui/charts";
import type { Tokens } from "@chakra-ui/react";
import { TrendPoint } from "@job-hype/shared";
import { CSSProperties, JSX } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import TrendSeriesChartTooltip from "./trend-series-chart-tooltip";

export type TrendSeriesProps = { points: TrendPoint[] };

function tickFormatter(value: unknown): string {
	if (typeof value !== "string") {
		throw new TypeError(
			`Expected tick formatter value to have a type of string but received '${typeof value}'`
		);
	}

	return value.slice(0, 3);
}

export default function TrendSeriesChart({
	points,
}: TrendSeriesProps): JSX.Element {
	const chart = useChart({
		data: points,
		series: [{ name: "index", color: "blue.solid", label: "Activity Index" }],
	});

	const chartColor = (
		token: Tokens["colors"] | CSSProperties["color"]
	): string => String(chart.color(token));

	const lines = chart.series.map(({ color, name }) => (
		<Line
			key={name}
			isAnimationActive={false}
			dataKey={chart.key(name)}
			fill={chartColor(color)}
			stroke={chartColor(color)}
			strokeWidth={2}
		/>
	));

	return (
		<Chart.Root maxH="sm" chart={chart}>
			<LineChart data={chart.data}>
				<CartesianGrid stroke={chartColor("whiteAlpha.300")} vertical={false} />

				<XAxis
					axisLine={false}
					dataKey={chart.key("bucket")}
					tickFormatter={tickFormatter}
				/>

				<YAxis axisLine={false} tickLine={false} width={24} />

				<Tooltip
					animationDuration={100}
					cursor={false}
					content={props => <TrendSeriesChartTooltip {...props} />}
				/>

				<Legend content={<Chart.Legend />} />

				{lines}
			</LineChart>
		</Chart.Root>
	);
}
