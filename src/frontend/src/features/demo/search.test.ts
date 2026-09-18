import { describe, expect, it } from "vitest";
import { searchSchema } from "./search";

describe("deelbare demoparameters", () => {
	it("negeert ongeldige scenario’s, rollen en datums", () => {
		expect(
			searchSchema.parse({
				scenario: "unknown",
				role: "owner",
				date: "2026-99-99",
			}),
		).toEqual({ scenario: undefined, role: undefined, date: undefined });
		expect(searchSchema.parse({ date: "2026-02-30" }).date).toBeUndefined();
		expect(searchSchema.parse({ date: "2026-09-19" }).date).toBe("2026-09-19");
	});
	it("vervolgt uitsluitend interne boekingsroutes na aanmelden", () => {
		expect(
			searchSchema.parse({ returnTo: "https://example.com" }).returnTo,
		).toBeUndefined();
		expect(
			searchSchema.parse({ returnTo: "//example.com" }).returnTo,
		).toBeUndefined();
		expect(
			searchSchema.parse({ returnTo: "/reserveren/buiten-14" }).returnTo,
		).toBe("/reserveren/buiten-14");
	});
});
