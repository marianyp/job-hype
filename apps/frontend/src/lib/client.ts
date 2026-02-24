import { jobContract, JobContract } from "@job-hype/shared";
import { createORPCClient } from "@orpc/client";
import { ContractRouterClient } from "@orpc/contract";
import { JsonifiedClient } from "@orpc/openapi-client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";

const apiBase = new URL("/api/", window.location.origin);

const link = new OpenAPILink(jobContract, {
	url: apiBase,
});

const orpc: JsonifiedClient<ContractRouterClient<JobContract>> =
	createORPCClient(link);

const client = {
	getTrends: orpc.job["trend-series"],
};

export default client;
