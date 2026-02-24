import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	experimental: {
		optimizePackageImports: ["@chakra-ui/react"],
	},
	rewrites() {
		if (process.env.NODE_ENV !== "development") {
			return [];
		}

		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:4000/:path*",
			},
		];
	},
};

export default nextConfig;
