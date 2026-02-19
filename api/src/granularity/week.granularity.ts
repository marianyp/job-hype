import { GranularityKey } from "@job-hype/shared";
import { Granularity } from "./granularity";

enum DayOfWeek {
	Sunday = "sunday",
	Monday = "monday",
	Tuesday = "tuesday",
	Wednesday = "wednesday",
	Thursday = "thursday",
	Friday = "friday",
	Saturday = "saturday",
}

export class WeekGranularity extends Granularity {
	public constructor() {
		super(GranularityKey.Week, 7);
	}

	protected getRawValue(date: Date): string {
		const days = Object.values(DayOfWeek);
		const day = days[date.getDay()];

		if (day === undefined) {
			throw new RangeError(`Unexpected day index: ${String(day)}`);
		}

		return day;
	}
}
