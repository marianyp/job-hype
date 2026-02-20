import { GranularityKey } from "@job-hype/shared";
import { dateAtUtcNoon } from "src/test/test.helpers";
import { MonthGranularity } from "./month.granularity";

describe("MonthGranularity", () => {
	let granularity: MonthGranularity;

	beforeEach(() => {
		granularity = new MonthGranularity();
	});

	describe("getKey", () => {
		it("should return the correct key", () => {
			expect(granularity.getKey()).toBe(GranularityKey.Month);
		});
	});

	describe("toJSON", () => {
		it("should serialize to its key", () => {
			expect(granularity.toJSON()).toBe(GranularityKey.Month);
		});
	});

	describe("getValue", () => {
		it("should return the correct month and day when a date is within 7 days of the origin", () => {
			const originDate = dateAtUtcNoon(1, 8, 2026);
			const dayBefore = dateAtUtcNoon(1, 7, 2026);

			expect(granularity.getValue(dayBefore, originDate)).toBe("january 7th");
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

		it("should map all dates correctly", () => {
			const sunday = dateAtUtcNoon(1, 4, 2026);

			const expected = [
				"january 4th",
				"january 5th",
				"january 6th",
				"january 7th",
				"january 8th",
				"january 9th",
				"january 10th",
				"january 11th",
				"january 12th",
				"january 13th",
				"january 14th",
				"january 15th",
				"january 16th",
				"january 17th",
				"january 18th",
				"january 19th",
				"january 20th",
				"january 21st",
				"january 22nd",
				"january 23rd",
				"january 24th",
				"january 25th",
				"january 26th",
				"january 27th",
				"january 28th",
				"january 29th",
				"january 30th",
				"january 31st",
				"february 1st",
				"february 2nd",
			];

			for (let i = 0; i < 30; i++) {
				const date = sunday.plus({ days: i });
				const origin = date.plus({ days: 1 });

				expect(granularity.getValue(date, origin)).toBe(expected[i]);
			}
		});
	});

	describe("getValues", () => {
		it("should return 30 values", () => {
			const originDate = dateAtUtcNoon(1, 8, 2026);

			const values = granularity.getValues(originDate);

			expect(values).toHaveLength(30);
		});

		it("should return weekday values from oldest to newest", () => {
			const originDate = dateAtUtcNoon(1, 8, 2026);

			const values = granularity.getValues(originDate);

			expect(values).toEqual([
				"december 9th",
				"december 10th",
				"december 11th",
				"december 12th",
				"december 13th",
				"december 14th",
				"december 15th",
				"december 16th",
				"december 17th",
				"december 18th",
				"december 19th",
				"december 20th",
				"december 21st",
				"december 22nd",
				"december 23rd",
				"december 24th",
				"december 25th",
				"december 26th",
				"december 27th",
				"december 28th",
				"december 29th",
				"december 30th",
				"december 31st",
				"january 1st",
				"january 2nd",
				"january 3rd",
				"january 4th",
				"january 5th",
				"january 6th",
				"january 7th",
			]);
		});

		it("should match getValue results", () => {
			const days = 30;

			const originDate = dateAtUtcNoon(1, 8, 2026);
			const values = granularity.getValues(originDate);

			for (let i = days; i >= 1; i--) {
				const date = originDate.minus({ days: i });

				const value = granularity.getValue(date, originDate);
				expect(value).toBe(values[days - i]);
			}
		});
	});
});
