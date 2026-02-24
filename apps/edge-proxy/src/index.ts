export interface Env {
	API_ORIGIN?: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (!url.pathname.startsWith("/api/")) {
			return new Response("Not found", { status: 404 });
		}

		const apiOrigin = env.API_ORIGIN;

		if (!apiOrigin) {
			console.error("Missing required env var: API_ORIGIN");
			return new Response("Service misconfigured", { status: 500 });
		}

		const upstreamPath = url.pathname.replace(/^\/api\/?/, "/");
		const upstreamUrl = new URL(upstreamPath + url.search, apiOrigin);

		const headers = new Headers(request.headers);

		try {
			const upstreamRequest = new Request(upstreamUrl.toString(), {
				method: request.method,
				headers,
				body: request.body,
				redirect: "manual",
			});

			const response = await fetch(upstreamRequest);

			if (response.status >= 500) {
				console.warn(`Upstream 5xx: ${response.status} for ${upstreamUrl}`);
			}

			return response;
		} catch (err) {
			console.error("Upstream fetch failed:", err);
			return new Response("Upstream fetch failed", { status: 502 });
		}
	},
};
