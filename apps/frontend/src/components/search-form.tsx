"use client";

import { Button, HStack, Input } from "@chakra-ui/react";
import { GranularityKey } from "@job-hype/shared";
import { useRouter } from "next/navigation";
import { ChangeEvent, JSX, SubmitEvent, useState } from "react";

export function SearchForm(): JSX.Element {
	const [query, setQuery] = useState("");
	const router = useRouter();

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>): void => {
		event.preventDefault();

		const normalizedQuery = query.trim().toLowerCase();

		if (normalizedQuery) {
			const params = new URLSearchParams({
				query: normalizedQuery,
				granularity: GranularityKey.Week,
			});

			void router.push(`/trend?${params.toString()}`);
		}
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>): void =>
		setQuery(event.target.value);

	return (
		<form onSubmit={handleSubmit}>
			<HStack
				borderWidth="thin"
				borderStyle="solid"
				borderColor="gray.700"
				borderRadius="full"
				p="3"
			>
				<Input
					name="query"
					value={query}
					onChange={handleChange}
					placeholder="Enter a job title, keywords, or a company name"
					border="none"
					outline="none"
					autoComplete="off"
				/>

				<Button type="submit" borderRadius="full" colorPalette="blue">
					Explore
				</Button>
			</HStack>
		</form>
	);
}
