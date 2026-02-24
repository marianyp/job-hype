import { Button } from "@chakra-ui/react";
import html2canvas from "html2canvas";
import { Image as ImageIcon } from "phosphor-react";
import {
	ComponentProps,
	JSX,
	PropsWithChildren,
	RefObject,
	useCallback,
} from "react";

export type DownloadElementButtonProps = PropsWithChildren<{
	colorPalette?: ComponentProps<typeof Button>["colorPalette"];
	elementRef: RefObject<HTMLElement | null>;
	fileName: string;
	width?: ComponentProps<typeof Button>["width"];
}>;

export default function DownloadElementButton({
	children,
	colorPalette,
	elementRef,
	fileName,
	width,
}: DownloadElementButtonProps): JSX.Element {
	const handleClick = useCallback(async () => {
		if (elementRef === null || elementRef.current === null) {
			return;
		}

		if (document.fonts?.ready !== undefined) {
			await document.fonts.ready;
		}

		const canvas = await html2canvas(elementRef.current, {
			backgroundColor: null,
			useCORS: true,
		});

		canvas.toBlob(blob => {
			if (blob) {
				const url = URL.createObjectURL(blob);

				const temporaryLink = document.createElement("a");
				temporaryLink.href = url;
				temporaryLink.download = `${fileName}.png`;
				temporaryLink.click();

				URL.revokeObjectURL(url);
			}
		}, "image/png");
	}, [elementRef, fileName]);

	return (
		<Button
			width={width}
			colorPalette={colorPalette}
			onClick={() => void handleClick()}
		>
			<ImageIcon weight="bold" />
			{children}
		</Button>
	);
}
