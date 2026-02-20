import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { REQUEST } from "@nestjs/core";
import { ORPCModule } from "@orpc/nest";
import { Request } from "express";
import { Env } from "src/config/env.schema";
import { DateModule } from "src/date/date.module";
import { DateService } from "src/date/date.service";
import { TrendSeriesCachePlugin } from "./trend-series-cache-plugin";

@Module({
	imports: [
		ORPCModule.forRootAsync({
			imports: [DateModule],
			inject: [REQUEST, CACHE_MANAGER, ConfigService, DateService],
			useFactory: (
				request: Request,
				cache: Cache,
				configService: ConfigService<Env>,
				dateService: DateService
			) => ({
				context: { request },
				plugins: [
					new TrendSeriesCachePlugin({
						cache,
						configService,
						dateService,
						getRequest: context => context.request,
					}),
				],
			}),
		}),
		DateModule,
	],
	providers: [],
	exports: [ORPCModule],
})
export class TrendSeriesCacheModule {}
