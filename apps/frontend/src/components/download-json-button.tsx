import { Button } from "@chakra-ui/react";
import { File } from "phosphor-react";
import { ComponentProps, JSX, PropsWithChildren, useCallback } from "react";

export type DownloadJsonButtonProps = PropsWithChildren<{
	colorPalette?: ComponentProps<typeof Button>["colorPalette"];
	data: Record<string | number, unknown>;
	fileName: string;
	width?: ComponentProps<typeof Button>["width"];
}>;

export default function DownloadJsonButton({
	children,
	colorPalette,
	data,
	fileName,
	width,
}: DownloadJsonButtonProps): JSX.Element {
	const handleClick = useCallback(() => {
		const json = JSON.stringify(data, null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const temporaryLink = document.createElement("a");
		temporaryLink.href = url;
		temporaryLink.download = `${fileName}.json`;
		temporaryLink.click();

		URL.revokeObjectURL(url);
	}, [data, fileName]);

	return (
		<Button width={width} colorPalette={colorPalette} onClick={handleClick}>
			<File weight="bold" />
			{children}
		</Button>
	);
}
