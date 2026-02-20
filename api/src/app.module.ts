import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { envSchema } from "./config/env.schema";
import { DateModule } from "./date/date.module";
import { JobModule } from "./job/job.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: config => {
				return envSchema.parse(config);
			},
		}),
		ThrottlerModule.forRoot([
			{ name: "short", ttl: 10_000, limit: 20 },
			{ name: "medium", ttl: 60_000, limit: 60 },
			{ name: "long", ttl: 600_000, limit: 300 },
		]),
		JobModule,
		DateModule,
	],
})
export class AppModule {}
