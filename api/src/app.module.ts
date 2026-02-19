import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./config/env.schema";
import { JobModule } from "./job/job.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: config => {
				return envSchema.parse(config);
			},
		}),
		JobModule,
	],
})
export class AppModule {}
