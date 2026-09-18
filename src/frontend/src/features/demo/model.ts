import { demoMinutes, hour } from "#/lib/format";
import catalog from "./data/catalog.json";
import cancel from "./data/scenarios/cancel.json";
import close from "./data/scenarios/close-slot.json";
import free from "./data/scenarios/free-confirmed.json";
import denied from "./data/scenarios/gate-denied.json";
import checking from "./data/scenarios/payment-checking.json";
import type { Booking, DemoAction, DemoState, Role, Slot } from "./types";

export const scenarios = [checking, cancel, close, denied, free];
export const scenarioIds = [
	"browse",
	"confirmed",
	"admin",
	"gate-allowed",
	"late-cancel",
	...scenarios.map((s) => s.id),
];
export function initialState(scenario = "browse", role?: Role): DemoState {
	const snapshot = scenarios.find((s) => s.id === scenario);
	const state: DemoState = {
		...(structuredClone(catalog) as Pick<
			DemoState,
			"fields" | "locations" | "slots" | "bookings"
		>),
		scenario,
		role:
			role ??
			(snapshot?.role as Role | undefined) ??
			(scenario === "browse"
				? "guest"
				: scenario === "admin" || scenario === "gate-allowed"
					? "admin"
					: "member"),
		now:
			snapshot?.now ??
			(scenario === "gate-allowed"
				? "2026-09-19T14:15"
				: scenario === "late-cancel"
					? "2026-09-19T13:01"
					: "2026-09-19T11:00"),
		attempts: [],
	};
	if (scenario === "browse")
		state.bookings = state.bookings.filter(
			(b) =>
				![
					"res-buiten-14",
					"res-noord-12",
					"res-noord-14",
					"res-parkzicht-12",
					"res-parkzicht-14",
				].includes(b.id),
		);
	if (scenario === "payment-checking")
		state.bookings = state.bookings.map((b) =>
			b.id === "res-buiten-14" ? { ...b, status: "checking", paid: false } : b,
		);
	if (scenario === "free-confirmed")
		state.bookings.push({
			id: "res-buiten-12",
			slotId: "buiten-12",
			sport: "Voetbal",
			name: "Sam de Vries",
			owner: "sam",
			status: "confirmed",
			paid: false,
			refund: "none",
			code: "62948173",
		});
	if (scenario === "gate-allowed" || scenario === "gate-denied")
		state.attempts = [
			{
				id: 1,
				time: "14:15",
				fieldName:
					scenario === "gate-allowed"
						? "Multiveld Buiten"
						: "Tennisbaan Parkzicht",
				allowed: scenario === "gate-allowed",
			},
		];
	return state;
}
export const slotStart = (slot: Slot) =>
	demoMinutes(`${slot.date}T${hour(slot.start)}`);
export const activeBooking = (state: DemoState, slotId: string) =>
	state.bookings.find(
		(b) =>
			b.slotId === slotId && b.status !== "cancelled" && b.status !== "failed",
	);
export const canCancel = (state: DemoState, booking: Booking) =>
	booking.status !== "cancelled" &&
	!!state.slots.find(
		(s) => s.id === booking.slotId && demoMinutes(state.now) < slotStart(s),
	);
export function refundAmount(
	state: DemoState,
	booking: Booking,
	force = false,
) {
	const slot = state.slots.find((s) => s.id === booking.slotId);
	return slot &&
		booking.paid &&
		(force || demoMinutes(state.now) <= slotStart(slot) - 60)
		? slot.price
		: 0;
}
export function checkAccess(state: DemoState, fieldId: string, code: string) {
	const booking = state.bookings.find(
		(b) => b.code === code.replaceAll(" ", "") && b.status === "confirmed",
	);
	const slot = state.slots.find((s) => s.id === booking?.slotId);
	return (
		!!slot &&
		!slot.closed &&
		slot.fieldId === fieldId &&
		demoMinutes(state.now) >= slotStart(slot) &&
		demoMinutes(state.now) < slotStart(slot) + 60
	);
}
export function demoReducer(state: DemoState, action: DemoAction): DemoState {
	switch (action.type) {
		case "reset":
			return initialState(state.scenario, state.role);
		case "role":
			return { ...state, role: action.role };
		case "time":
			return { ...state, now: action.now };
		case "book": {
			const slot = state.slots.find((s) => s.id === action.slotId);
			const field = state.fields.find((f) => f.id === slot?.fieldId);
			if (
				!slot ||
				!field?.active ||
				!state.locations.find((l) => l.id === field.locationId)?.active ||
				!field.sports.includes(action.sport) ||
				state.role === "guest" ||
				slot.closed ||
				activeBooking(state, slot.id) ||
				demoMinutes(state.now) >= slotStart(slot)
			)
				return state;
			const booking: Booking = {
				id: `res-${slot.id}`,
				slotId: slot.id,
				sport: action.sport,
				name: "Sam de Vries",
				owner: "sam",
				status: slot.price === 0 ? "confirmed" : "pending",
				paid: false,
				refund: "none",
				code:
					slot.id === "buiten-14"
						? "48371902"
						: String(62000000 + state.bookings.length * 719),
			};
			return {
				...state,
				bookings: [
					...state.bookings.filter((b) => b.id !== booking.id),
					booking,
				],
			};
		}
		case "payment":
			return {
				...state,
				bookings: state.bookings.map((b) =>
					b.id === action.id &&
					(b.status === "pending" ||
						b.status === "failed" ||
						b.status === "checking")
						? {
								...b,
								status: action.outcome,
								paid: action.outcome === "confirmed",
							}
						: b,
				),
			};
		case "cancel":
			return {
				...state,
				bookings: state.bookings.map((b) =>
					b.id === action.id && canCancel(state, b)
						? {
								...b,
								status: "cancelled",
								refund: refundAmount(state, b) ? "processing" : "none",
							}
						: b,
				),
			};
		case "close":
			return {
				...state,
				slots: state.slots.map((s) =>
					s.id === action.slotId
						? { ...s, closed: true, reason: action.reason }
						: s,
				),
				bookings: state.bookings.map((b) =>
					b.slotId === action.slotId && b.status !== "cancelled"
						? {
								...b,
								status: "cancelled",
								refund: refundAmount(state, b, true) ? "processing" : "none",
							}
						: b,
				),
			};
		case "reopen":
			return {
				...state,
				slots: state.slots.map((s) =>
					s.id === action.slotId
						? { ...s, closed: false, reason: undefined }
						: s,
				),
			};
		case "save-field":
			return {
				...state,
				fields: [
					...state.fields.filter((f) => f.id !== action.field.id),
					action.field,
				],
			};
		case "save-location":
			return {
				...state,
				locations: [
					...state.locations.filter((l) => l.id !== action.location.id),
					action.location,
				],
			};
		case "generate": {
			const field = state.fields.find((f) => f.id === action.fieldId);
			if (!field) return state;
			const slots = Array.from(
				{ length: field.closes - field.opens },
				(_, i) => ({
					id: `${field.id}-${action.date}-${i + field.opens}`,
					fieldId: field.id,
					date: action.date,
					start: i + field.opens,
					price: field.defaultPrice,
					closed: false,
				}),
			).filter(
				(s) =>
					!state.slots.some(
						(old) =>
							old.fieldId === s.fieldId &&
							old.date === s.date &&
							old.start === s.start,
					),
			);
			return { ...state, slots: [...state.slots, ...slots] };
		}
		case "attempt":
			return {
				...state,
				attempts: [
					{
						id: (state.attempts[0]?.id ?? 0) + 1,
						time: state.now.slice(11),
						fieldName:
							state.fields.find((f) => f.id === action.fieldId)?.name ?? "",
						allowed: checkAccess(state, action.fieldId, action.code),
					},
					...state.attempts,
				].slice(0, 6),
			};
	}
}
