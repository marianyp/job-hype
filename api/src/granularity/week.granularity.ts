import { GranularityKey } from "@job-hype/shared";
import { DateTime } from "luxon";
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

	protected getRawValue(date: DateTime): string {
		const days = Object.values(DayOfWeek);
		const dayIndex = date.weekday % 7;
		const day = days[dayIndex];

		if (day === undefined) {
			throw new RangeError(`Unexpected day index: ${dayIndex}`);
		}

		return day;
	}
}
