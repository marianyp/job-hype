export function dateAtUtcNoon(month: number, day: number, year: number): Date {
	return new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
}
