import { Module } from "@nestjs/common";
import { GranularityRegistry } from "./granularity.registry";
import { GRANULARITIES } from "./granularity.tokens";
import { MonthGranularity } from "./month.granularity";
import { WeekGranularity } from "./week.granularity";

@Module({
	providers: [
		GranularityRegistry,

		MonthGranularity,
		WeekGranularity,

		{
			provide: GRANULARITIES,
			useFactory: (month: MonthGranularity, week: WeekGranularity) => [
				month,
				week,
			],
			inject: [MonthGranularity, WeekGranularity],
		},
	],
	exports: [GranularityRegistry],
})
export class GranularityModule {}
