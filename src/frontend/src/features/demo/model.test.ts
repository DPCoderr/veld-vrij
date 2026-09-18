import { describe, expect, it } from "vitest";
import {
	activeBooking,
	canCancel,
	checkAccess,
	demoReducer,
	initialState,
	refundAmount,
} from "./model";

describe("boeking en beschikbaarheid", () => {
	it("behoudt unieke historie-ID’s nadat oude pogingen verdwijnen", () => {
		let state = initialState("gate-allowed");
		for (let i = 0; i < 10; i++)
			state = demoReducer(state, {
				type: "attempt",
				fieldId: "multiveld-buiten",
				code: "48371902",
			});
		expect(state.attempts).toHaveLength(6);
		expect(new Set(state.attempts.map((a) => a.id)).size).toBe(6);
	});
	it("begint onafhankelijk en wijzigt JSON nooit", () => {
		const a = initialState("browse", "member");
		const b = initialState("browse", "member");
		const next = demoReducer(a, {
			type: "book",
			slotId: "buiten-14",
			sport: "Voetbal",
		});
		expect(next.bookings.length).toBe(a.bookings.length + 1);
		expect(a).toEqual(b);
		expect(next.bookings.find((b) => b.id === "res-buiten-14")?.paid).toBe(
			false,
		);
	});
	it("deelt één tijdslot tussen sporten", () => {
		let s = initialState("browse", "member");
		s = demoReducer(s, { type: "book", slotId: "buiten-14", sport: "Voetbal" });
		expect(
			demoReducer(s, { type: "book", slotId: "buiten-14", sport: "Basketbal" }),
		).toBe(s);
		expect(activeBooking(s, "buiten-14")?.sport).toBe("Voetbal");
	});
	it("weigert gasten, gesloten velden en ongeldige sporten", () => {
		const guest = initialState();
		expect(
			demoReducer(guest, {
				type: "book",
				slotId: "buiten-12",
				sport: "Voetbal",
			}),
		).toBe(guest);
		const s = initialState("browse", "member");
		expect(
			demoReducer(s, { type: "book", slotId: "buiten-15", sport: "Voetbal" }),
		).toBe(s);
		expect(
			demoReducer(s, { type: "book", slotId: "buiten-12", sport: "Tennis" }),
		).toBe(s);
	});
	it("bevestigt gratis direct, zonder betaling", () => {
		const s = demoReducer(initialState("browse", "member"), {
			type: "book",
			slotId: "buiten-12",
			sport: "Voetbal",
		});
		expect(activeBooking(s, "buiten-12")).toMatchObject({
			status: "confirmed",
			paid: false,
			refund: "none",
		});
	});
	it("betaalcontrole bevestigt niet voortijdig", () => {
		let s = demoReducer(initialState("browse", "member"), {
			type: "book",
			slotId: "buiten-14",
			sport: "Voetbal",
		});
		s = demoReducer(s, {
			type: "payment",
			id: "res-buiten-14",
			outcome: "checking",
		});
		s = demoReducer(s, { type: "time", now: "2026-09-19T14:15" });
		expect(checkAccess(s, "multiveld-buiten", "48371902")).toBe(false);
		s = demoReducer(s, {
			type: "payment",
			id: "res-buiten-14",
			outcome: "confirmed",
		});
		expect(checkAccess(s, "multiveld-buiten", "48371902")).toBe(true);
	});
	it("reset herstelt de gekozen snapshot", () => {
		const s = demoReducer(initialState("confirmed"), {
			type: "cancel",
			id: "res-buiten-14",
		});
		expect(demoReducer(s, { type: "reset" })).toEqual(
			initialState("confirmed"),
		);
	});
});
describe("annuleren en toegang", () => {
	it.each([
		["12:59", 1200],
		["13:00", 1200],
		["13:01", 0],
		["13:59", 0],
	])("terugbetaling om %s is %i", (time, amount) => {
		const s = { ...initialState("confirmed"), now: `2026-09-19T${time}` };
		const b = s.bookings.find((b) => b.id === "res-buiten-14");
		if (!b) throw new Error("Reserveringsfixture ontbreekt");
		expect(refundAmount(s, b)).toBe(amount);
		const next = demoReducer(s, { type: "cancel", id: b.id });
		expect(next.bookings.find((b) => b.id === "res-buiten-14")?.refund).toBe(
			amount ? "processing" : "none",
		);
		expect(
			checkAccess(
				{ ...next, now: "2026-09-19T14:15" },
				"multiveld-buiten",
				"48371902",
			),
		).toBe(false);
	});
	it("annuleren stopt op de begintijd", () => {
		const s = { ...initialState("confirmed"), now: "2026-09-19T14:00" };
		const b = s.bookings.find((b) => b.id === "res-buiten-14");
		if (!b) throw new Error("Reserveringsfixture ontbreekt");
		expect(canCancel(s, b)).toBe(false);
		expect(demoReducer(s, { type: "cancel", id: b.id }).bookings).toEqual(
			s.bookings,
		);
	});
	it.each([
		["13:59", false],
		["14:00", true],
		["14:59", true],
		["15:00", false],
	])("toegang om %s is %s", (time, allowed) => {
		const s = { ...initialState("confirmed"), now: `2026-09-19T${time}` };
		expect(checkAccess(s, "multiveld-buiten", "48371902")).toBe(allowed);
		expect(checkAccess(s, "tennisbaan-parkzicht", "48371902")).toBe(false);
	});
	it("beheer sluit, annuleert en betaalt terug; heropenen herstelt de boeking niet", () => {
		const s = initialState("gate-allowed");
		const closed = demoReducer(s, {
			type: "close",
			slotId: "buiten-14",
			reason: "Onderhoud",
		});
		expect(closed.bookings.find((b) => b.id === "res-buiten-14")).toMatchObject(
			{ status: "cancelled", refund: "processing" },
		);
		expect(checkAccess(closed, "multiveld-buiten", "48371902")).toBe(false);
		const reopened = demoReducer(closed, {
			type: "reopen",
			slotId: "buiten-14",
		});
		expect(activeBooking(reopened, "buiten-14")).toBeUndefined();
		expect(checkAccess(reopened, "multiveld-buiten", "48371902")).toBe(false);
	});
	it("bewaart geen codes in de pogingenhistorie", () => {
		const s = demoReducer(initialState("gate-allowed"), {
			type: "attempt",
			fieldId: "multiveld-buiten",
			code: "48371902",
		});
		expect(s.attempts[0].allowed).toBe(true);
		expect(JSON.stringify(s.attempts)).not.toContain("48371902");
	});
});
describe("veldbeheer", () => {
	it("genereert alleen ontbrekende uren en bewaart bestaande prijzen", () => {
		let s = initialState("admin");
		const f = s.fields.find((f) => f.id === "multiveld-buiten");
		if (!f) throw new Error("Veldfixture ontbreekt");
		s = demoReducer(s, {
			type: "save-field",
			field: { ...f, defaultPrice: 500 },
		});
		s = demoReducer(s, { type: "generate", fieldId: f.id, date: "2026-09-19" });
		expect(s.slots.find((s) => s.id === "buiten-14")?.price).toBe(1200);
		expect(
			s.slots.find((s) => s.fieldId === f.id && s.start === 8)?.price,
		).toBe(500);
		expect(
			s.slots.filter((s) => s.fieldId === f.id && s.date === "2026-09-19"),
		).toHaveLength(14);
		const next = demoReducer(s, {
			type: "generate",
			fieldId: f.id,
			date: "2026-09-19",
		});
		expect(next.slots).toEqual(s.slots);
	});
	it("verandert alleen de geselecteerde locatie", () => {
		const s = initialState("admin");
		const next = demoReducer(s, {
			type: "save-location",
			location: { ...s.locations[0], name: "Nieuwe naam" },
		});
		expect(next.locations.find((l) => l.id === "noord")?.name).toBe(
			"Nieuwe naam",
		);
		expect(next.fields).toEqual(s.fields);
	});
});
