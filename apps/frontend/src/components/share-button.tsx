"use client";

import { Button } from "@chakra-ui/react";
import { Link } from "phosphor-react";
import { ComponentProps, JSX, PropsWithChildren, useCallback } from "react";

export type ShareButtonProps = PropsWithChildren<{
	colorPalette?: ComponentProps<typeof Button>["colorPalette"];
	query: string;
	width?: ComponentProps<typeof Button>["width"];
}>;

export default function ShareButton({
	children,
	colorPalette,
	query,
	width,
}: ShareButtonProps): JSX.Element {
	const handleClick = useCallback(() => {
		void navigator.share({
			title: "JobHype",
			text: query,
			url: window.location.href,
		});
	}, [query]);

	return (
		<Button width={width} colorPalette={colorPalette} onClick={handleClick}>
			<Link weight="bold" />
			{children}
		</Button>
	);
}
