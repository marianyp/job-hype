import { DateTime } from "luxon";
import { Job } from "./job";

describe("Job", () => {
	describe("parseDate", () => {
		it("should parse valid ISO date strings", () => {
			const isoDate = "2026-02-17T19:00:00.000-05:00";

			const result = Job.parseDate(isoDate);

			expect(result).toBeInstanceOf(DateTime);
			expect(result).not.toBeNull();
			expect(result?.toISO()).toBe(isoDate);
		});

		it("should return null for invalid date strings", () => {
			expect(Job.parseDate("not a date")).toBeNull();
			expect(Job.parseDate("2026-99-99T00:00:00.000-05:00")).toBeNull();
		});
	});
});
