export const money = (cents: number) =>
	new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(
		cents / 100,
	);
export const price = (cents: number) => (cents === 0 ? "Gratis" : money(cents));
export const hour = (value: number) => `${String(value).padStart(2, "0")}:00`;
export const timeRange = (start: number) => `${hour(start)}–${hour(start + 1)}`;
export function dateLabel(date: string, weekday = true) {
	const value = new Intl.DateTimeFormat("nl-NL", {
		timeZone: "UTC",
		...(weekday ? { weekday: "long" as const } : {}),
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date(`${date}T12:00:00Z`));
	return value.charAt(0).toUpperCase() + value.slice(1);
}
// Demo wall-clock values are Amsterdam local time, deliberately independent of the host timezone.
export const demoMinutes = (value: string) =>
	Date.parse(`${value}:00Z`) / 60000;
