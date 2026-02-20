import { DateTime } from "luxon";

export function dateAtUtcNoon(
	month: number,
	day: number,
	year: number
): DateTime {
	return DateTime.utc(year, month, day, 12, 0, 0);
}
