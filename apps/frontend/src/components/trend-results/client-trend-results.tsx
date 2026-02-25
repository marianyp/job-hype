"use client";

import { GranularityKey } from "@job-hype/shared";
import { useSearchParams } from "next/navigation";
import { JSX, useCallback } from "react";
import TrendResults from ".";

export default function ClientTrendResults(): JSX.Element {
	const searchParams = useSearchParams();

	const normalize = useCallback(
		(value: string | null) => (value ?? "").trim().toLowerCase(),
		[]
	);

	const isGranularity = useCallback(
		(value: string): value is GranularityKey => {
			return Object.values(GranularityKey).map(String).includes(value);
		},
		[]
	);

	const query = normalize(searchParams.get("query"));

	const granularityParam = normalize(searchParams.get("granularity"));

	const granularity = isGranularity(granularityParam)
		? granularityParam
		: GranularityKey.Week;

	return <TrendResults query={query} granularity={granularity} />;
}
