import Footer from "@/components/footer";
import { Container, Heading, VStack } from "@chakra-ui/react";
import clsx from "clsx";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { JSX, PropsWithChildren } from "react";
import "./globals.css";
import Provider from "./provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "JobHype",
	description:
		"Optimize your job search and discover what job postings are trending.",
};

export default function RootLayout({
	children,
}: PropsWithChildren): JSX.Element {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={clsx(
					"antialiased flex flex-col",
					geistSans.variable,
					geistMono.variable
				)}
			>
				<Provider>
					<VStack as="main" flex="1" padding="4">
						<Heading marginY="6">
							<Link href="/">
								<Image
									src="/logo.svg"
									alt="JobHype logo"
									width={200}
									height={40}
								></Image>
							</Link>
						</Heading>

						<Container display="flex" flexDirection="column" flex="1">
							{children}
						</Container>
					</VStack>

					<Footer />
				</Provider>
			</body>
		</html>
	);
}
