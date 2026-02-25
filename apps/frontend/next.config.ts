import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
	output: "export",
	experimental: {
		optimizePackageImports: ["@chakra-ui/react"],
	},
};

if (isDevelopment) {
	nextConfig.rewrites = () => {
		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:4000/:path*",
			},
		];
	};
}

export default nextConfig;
