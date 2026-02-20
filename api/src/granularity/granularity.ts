import { GranularityKey } from "@job-hype/shared";
import { DateTime } from "luxon";

export abstract class Granularity {
	public constructor(
		private readonly key: GranularityKey,
		private readonly dayRange: number
	) {}

	public getKey(): GranularityKey {
		return this.key;
	}

	public getValue(date: DateTime, origin: DateTime): string | null {
		if (this.isInBounds(date, origin)) {
			return this.getRawValue(date).toLowerCase();
		}

		return null;
	}

	protected isInBounds(date: DateTime, originDate: DateTime): boolean {
		const base = originDate.toUTC().startOf("day");
		const target = date.toUTC().startOf("day");

		const daysElapsed = Math.trunc(base.diff(target, "days").days);

		return daysElapsed >= 1 && daysElapsed <= this.dayRange;
	}

	public getValues(originDate: DateTime): string[] {
		const originUtcDate = originDate.toUTC();
		const values: string[] = [];

		for (let i = this.dayRange; i >= 1; i--) {
			const date = originUtcDate.minus({ days: i });
			values.push(this.getRawValue(date).toLowerCase());
		}

		return values;
	}

	public toJSON(): GranularityKey {
		return this.getKey();
	}

	protected abstract getRawValue(date: DateTime): string;
}
