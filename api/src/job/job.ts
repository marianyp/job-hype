export class Job {
	public readonly postedDate: Date;

	public constructor(value: Date | string) {
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

	public static parseDate(value: string): Date | null {
		const date = new Date(value);

		if (isNaN(date.valueOf())) {
			return null;
		}

		return date;
	}
}
