import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DateTime } from "luxon";
import { Env } from "src/config/env.schema";

@Injectable()
export class DateService {
	public constructor(private readonly configService: ConfigService<Env>) {}

	public getDate(): DateTime {
		const timezone = this.configService.getOrThrow("TIMEZONE", { infer: true });
		return DateTime.now().setZone(timezone);
	}
}
