import { GranularityKey } from "@job-hype/shared";
import { DateTime } from "luxon";
import { Granularity } from "./granularity";

export class MonthGranularity extends Granularity {
	public constructor() {
		super(GranularityKey.Month, 30);
	}

	protected getRawValue(date: DateTime): string {
		const monthName = date.setLocale("en-US").toFormat("LLLL");
		const dayOfMonth = date.day;

		const lastTwoDigits = dayOfMonth % 100;
		const lastDigit = dayOfMonth % 10;

		let ordinalSuffix = "th";

		if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
			ordinalSuffix = "th";
		} else if (lastDigit === 1) {
			ordinalSuffix = "st";
		} else if (lastDigit === 2) {
			ordinalSuffix = "nd";
		} else if (lastDigit === 3) {
			ordinalSuffix = "rd";
		}

		return `${monthName} ${dayOfMonth}${ordinalSuffix}`;
	}
}
