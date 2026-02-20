import { Cache, CACHE_MANAGER, CacheModule } from "@nestjs/cache-manager";
import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { REQUEST } from "@nestjs/core";
import { ORPCModule } from "@orpc/nest";
import { CacheableMemory } from "cacheable";
import { Request } from "express";
import { Keyv } from "keyv";
import { Env } from "src/config/env.schema";
import { DateModule } from "src/date/date.module";
import { DateService } from "src/date/date.service";
import { TrendSeriesCachePlugin } from "./trend-series-cache-plugin";

@Module({})
export class TrendSeriesCacheModule {
	public static register(size: number): DynamicModule {
		return {
			module: TrendSeriesCacheModule,
			imports: [
				ORPCModule.forRootAsync({
					imports: [
						DateModule,
						CacheModule.register({
							stores: [
								new Keyv({
									store: new CacheableMemory({
										lruSize: size,
									}),
								}),
							],
						}),
					],
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
		};
	}
}
