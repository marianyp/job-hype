import { jobContract, JobContract } from "@job-hype/shared";
import { createORPCClient } from "@orpc/client";
import { ContractRouterClient } from "@orpc/contract";
import { JsonifiedClient } from "@orpc/openapi-client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";

const link = new OpenAPILink(jobContract, {
	url: "http://127.0.0.1:4000",
});

const orpc: JsonifiedClient<ContractRouterClient<JobContract>> =
	createORPCClient(link);

const client = {
	getTrends: orpc.job["trend-series"],
};

export default client;
