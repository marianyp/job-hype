import {
	TrendSeriesDtoSchema,
	TrendSeriesInputSchema,
	type TrendSeriesInput,
} from "@job-hype/shared";
import { Logger } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { Context } from "@orpc/server";
import {
	StandardHandleResult,
	StandardHandlerOptions,
	StandardHandlerPlugin,
} from "@orpc/server/standard";
import type { Cache } from "cache-manager";
import type { Request } from "express";

import type { Env } from "src/config/env.schema";
import { DateService } from "src/date/date.service";

type GetRequest<T> = (context: T) => Request | undefined;

export interface TrendSeriesCachePluginOptions<T extends Context> {
	cache: Cache;
	configService: ConfigService<Env>;
	dateService: DateService;
	getRequest: GetRequest<T>;
}

export class TrendSeriesCachePlugin<
	T extends Context,
> implements StandardHandlerPlugin<T> {
	private readonly cache: Cache;
	private readonly configService: ConfigService<Env>;
	private readonly dateService: DateService;
	private readonly getRequest: GetRequest<T>;
	private readonly logger = new Logger(TrendSeriesCachePlugin.name);

	public constructor(options: TrendSeriesCachePluginOptions<T>) {
		this.cache = options.cache;
		this.configService = options.configService;
		this.dateService = options.dateService;
		this.getRequest = options.getRequest;
	}

	public init(options: StandardHandlerOptions<T>): void {
		options.interceptors ??= [];

		options.interceptors.unshift(async interceptorOptions => {
			const { next } = interceptorOptions;

			const request = this.getRequest(interceptorOptions.context);

			if (!request) {
				return await next();
			}

			if (request.method !== "GET") {
				return await next();
			}

			const parsedQuery = TrendSeriesInputSchema.safeParse(request.query);

			if (!parsedQuery.success) {
				return await next();
			}

			const key = this.getCacheKey(parsedQuery.data);

			const parsedCachedValue = await this.cache
				.get(key)
				.then(TrendSeriesDtoSchema.safeParse);

			if (parsedCachedValue.success) {
				const hitResult: StandardHandleResult = {
					matched: true,
					response: {
						status: 200,
						headers: {
							"content-type": "application/json",
							"x-cache": "hit",
						},
						body: parsedCachedValue.data,
					},
				};

				return hitResult;
			}

			const result = await next();

			if (result.matched) {
				this.cacheData(key, result.response.body);
			}

			return result;
		});
	}

	private getCacheKey({ granularity, title }: TrendSeriesInput): string {
		const version = this.configService.get("CACHE_VERSION", { infer: true });

		if (version === undefined) {
			throw new ReferenceError("Cache version is not defined");
		}

		const normalizedTitle = encodeURIComponent(title.trim().toLowerCase());

		return `v${version}:trend-series:granularity=${granularity}:title=${normalizedTitle}`;
	}

	private cacheData(key: string, data: unknown): void {
		const millisecondsToLive = this.getMillisecondsToEndOfDay();

		try {
			const parsedResponse = TrendSeriesDtoSchema.safeParse(data);

			if (parsedResponse.success) {
				this.cache.set(key, parsedResponse.data, millisecondsToLive);
			} else {
				this.logger.error(
					`Found invalid trend series shape for cache ${JSON.stringify(data)}`
				);
			}
		} catch (error) {
			this.logger.error(error);
		}
	}

	private getMillisecondsToEndOfDay(): number {
		const now = this.dateService.getDate();
		const endOfDay = now.endOf("day");
		return Math.max(1, endOfDay.toMillis() - now.toMillis());
	}
}
