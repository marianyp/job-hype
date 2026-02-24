import { ConfigModule } from "@nestjs/config";
import { envSchema } from "src/config/env.schema";

export default [
	ConfigModule.forRoot({
		isGlobal: true,
		validate: config => envSchema.parse(config),
	}),
];
