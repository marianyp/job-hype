import { GranularityKey } from "@job-hype/shared";

export abstract class Granularity {
	public constructor(
		private readonly key: GranularityKey,
		private readonly dayRange: number
	) {}

	public getKey(): GranularityKey {
		return this.key;
	}

	public getValue(date: Date, origin: Date): string | null {
		if (this.isInBounds(date, origin)) {
			return this.getRawValue(date).toLowerCase();
		}

		return null;
	}

	protected isInBounds(date: Date, originDate: Date): boolean {
		const base = new Date(originDate);
		base.setHours(12, 0, 0, 0);

		const target = new Date(date);
		target.setHours(12, 0, 0, 0);

		const millisecondsPerDay = 24 * 60 * 60 * 1000;

		const daysElapsed = Math.floor(
			(base.getTime() - target.getTime()) / millisecondsPerDay
		);

		return daysElapsed >= 1 && daysElapsed <= this.dayRange;
	}

	public getValues(originDate: Date): string[] {
		const base = new Date(originDate);
		const values: string[] = [];

		for (let i = this.dayRange; i >= 1; i--) {
			const date = new Date(base);
			date.setDate(originDate.getDate() - i);
			values.push(this.getRawValue(date).toLowerCase());
		}

		return values;
	}

	public toJSON(): GranularityKey {
		return this.getKey();
	}

	protected abstract getRawValue(date: Date): string;
}
