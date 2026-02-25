import type {
	ExecutionContext,
	ScheduledEvent,
} from "@cloudflare/workers-types";

export interface Env {
	API_ORIGIN?: string;
}

export default {
	scheduled(_event: ScheduledEvent, env: Env, context: ExecutionContext) {
		context.waitUntil(
			fetch(`${env.API_ORIGIN}/ping`, {
				method: "GET",
				headers: { "user-agent": "cf-keep-warm" },
			})
		);
	},
};
