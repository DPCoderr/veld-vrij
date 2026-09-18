export type Sport = "Voetbal" | "Tennis" | "Basketbal";
export type Role = "guest" | "member" | "admin";
export type BookingStatus =
	| "confirmed"
	| "pending"
	| "checking"
	| "failed"
	| "cancelled";
export interface Location {
	id: string;
	name: string;
	address: string;
	active: boolean;
}
export interface Field {
	id: string;
	name: string;
	locationId: string;
	sports: Sport[];
	image: string;
	surface: string;
	capacity: number;
	description: string;
	lighting: boolean;
	opens: number;
	closes: number;
	defaultPrice: number;
	active: boolean;
}
export interface Slot {
	id: string;
	fieldId: string;
	date: string;
	start: number;
	price: number;
	closed: boolean;
	reason?: string;
}
export interface Booking {
	id: string;
	slotId: string;
	sport: Sport;
	name: string;
	owner: "sam" | "other";
	status: BookingStatus;
	paid: boolean;
	refund: "none" | "processing" | "refunded";
	code: string;
}
export interface Attempt {
	id: number;
	time: string;
	fieldName: string;
	allowed: boolean;
}
export interface DemoState {
	scenario: string;
	role: Role;
	now: string;
	locations: Location[];
	fields: Field[];
	slots: Slot[];
	bookings: Booking[];
	attempts: Attempt[];
}
export type DemoAction =
	| { type: "reset" }
	| { type: "role"; role: Role }
	| { type: "book"; slotId: string; sport: Sport }
	| {
			type: "payment";
			id: string;
			outcome: "confirmed" | "failed" | "checking";
	  }
	| { type: "cancel"; id: string }
	| { type: "close"; slotId: string; reason: string }
	| { type: "reopen"; slotId: string }
	| { type: "save-field"; field: Field }
	| { type: "save-location"; location: Location }
	| { type: "generate"; fieldId: string; date: string }
	| { type: "attempt"; fieldId: string; code: string }
	| { type: "time"; now: string };
