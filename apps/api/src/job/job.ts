import { DateTime } from "luxon";

export class Job {
	public readonly postedDate: DateTime;

	public constructor(value: DateTime | string) {
		if (typeof value === "string") {
			const date = Job.parseDate(value);

			if (date === null) {
				throw new RangeError("Invalid date");
			}

			this.postedDate = date;
		} else {
			this.postedDate = value;
		}
	}

	public static parseDate(value: string): DateTime | null {
		const date = DateTime.fromISO(value, { setZone: true });

		if (isNaN(date.valueOf())) {
			return null;
		}

		return date;
	}
}
