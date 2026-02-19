import { GranularityKey } from "@job-hype/shared";
import { dateAtUtcNoon } from "src/test/test.helpers";
import { WeekGranularity } from "./week.granularity";

describe("WeekGranularity", () => {
	let granularity: WeekGranularity;

	beforeEach(() => {
		granularity = new WeekGranularity();
	});

	describe("getKey", () => {
		it("should return the correct key", () => {
			expect(granularity.getKey()).toBe(GranularityKey.Week);
		});
	});

	describe("toJSON", () => {
		it("should serialize to its key", () => {
			expect(granularity.toJSON()).toBe(GranularityKey.Week);
		});
	});

	describe("getValue", () => {
		it("should return the correct weekday when a date is within 7 days of the origin", () => {
			const originDate = dateAtUtcNoon(1, 8, 2026);
			const dayBefore = dateAtUtcNoon(1, 7, 2026);

			expect(granularity.getValue(dayBefore, originDate)).toBe("wednesday");
		});

		it("should return null when a date is within 24 hours of the origin", () => {
			const originDate = dateAtUtcNoon(1, 8, 2026);
			const sameDay = dateAtUtcNoon(1, 8, 2026);

			expect(granularity.getValue(sameDay, originDate)).toBeNull();
		});

		it("should return null when a date is more than 7 days before the origin", () => {
			const originDate = dateAtUtcNoon(1, 8, 2026);
			const eightDaysBefore = dateAtUtcNoon(11, 31, 2025);

			expect(granularity.getValue(eightDaysBefore, originDate)).toBeNull();
		});

		it("should return null when a date is after the origin", () => {
			const originDate = dateAtUtcNoon(1, 8, 2026);
			const dayAfter = dateAtUtcNoon(1, 9, 2026);

			expect(granularity.getValue(dayAfter, originDate)).toBeNull();
		});

		it("should map all days correctly", () => {
			const sunday = dateAtUtcNoon(1, 4, 2026);

			const expected = [
				"sunday",
				"monday",
				"tuesday",
				"wednesday",
				"thursday",
				"friday",
				"saturday",
			];

			for (let i = 0; i < 7; i++) {
				const date = new Date(sunday);
				date.setUTCDate(date.getUTCDate() + i);

				const origin = new Date(date);
				origin.setUTCDate(origin.getUTCDate() + 1);

				expect(granularity.getValue(date, origin)).toBe(expected[i]);
			}
		});
	});

	describe("getValues", () => {
		it("should return 7 values", () => {
			const originDate = dateAtUtcNoon(1, 8, 2026);

			const values = granularity.getValues(originDate);

			expect(values).toHaveLength(7);
		});

		it("should return weekday values from oldest to newest", () => {
			const originDate = dateAtUtcNoon(1, 8, 2026);

			const values = granularity.getValues(originDate);

			expect(values).toEqual([
				"thursday",
				"friday",
				"saturday",
				"sunday",
				"monday",
				"tuesday",
				"wednesday",
			]);
		});

		it("should match getValue results", () => {
			const originDate = dateAtUtcNoon(1, 8, 2026);
			const values = granularity.getValues(originDate);

			for (let i = 7; i >= 1; i--) {
				const date = new Date(originDate);
				date.setUTCDate(date.getUTCDate() - i);

				const value = granularity.getValue(date, originDate);
				expect(value).toBe(values[7 - i]);
			}
		});
	});
});
