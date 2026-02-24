import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
	const port = process.env.PORT;

	if (port === undefined) {
		throw new TypeError("Application port is not defined");
	}

	if (isNaN(+port)) {
		throw new TypeError("Application port is not a valid number");
	}

	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	});

	await app.listen(port);
}

bootstrap().catch(console.error);
