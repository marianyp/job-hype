import { jobContract, JobContract } from "@job-hype/shared";
import { createORPCClient } from "@orpc/client";
import { ContractRouterClient } from "@orpc/contract";
import { JsonifiedClient } from "@orpc/openapi-client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";

type ORPCClient = JsonifiedClient<ContractRouterClient<JobContract>>;

export type Client = {
	getTrends: ORPCClient["job"]["trend-series"];
};

export default function createClient(): Client {
	const link = new OpenAPILink(jobContract, {
		url: new URL("/api/", window.location.href),
	});

	const orpc = createORPCClient<ORPCClient>(link);

	return {
		getTrends: orpc["job"]["trend-series"],
	};
}
