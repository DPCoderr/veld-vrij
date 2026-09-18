import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { DatePicker } from "#/components/shared/date-picker";
import { PageHeading } from "#/components/shared/page-heading";
import { SelectField } from "#/components/shared/select-field";
import { StateBoundary } from "#/components/shared/state-boundary";
import { Button } from "#/components/ui/button";
import data from "#/features/demo/data/pages/beheer-reserveringen.json";
import { useDemo } from "#/features/demo/demo-provider";
import { BookingTable } from "./booking-table";
export function BookingsAdminPage() {
	const { state } = useDemo();
	const [date, setDate] = useState(data.date);
	const [location, setLocation] = useState("all");
	const [field, setField] = useState("all");
	const [status, setStatus] = useState("all");
	const [filters, setFilters] = useState(false);
	const bookings = state.bookings
		.filter((b) => {
			const s = state.slots.find((s) => s.id === b.slotId);
			const f = state.fields.find((f) => f.id === s?.fieldId);
			return (
				s?.date === date &&
				(location === "all" || f?.locationId === location) &&
				(field === "all" || f?.id === field) &&
				(status === "all" || b.status === status)
			);
		})
		.sort(
			(a, b) =>
				(state.slots.find((s) => s.id === a.slotId)?.start ?? 0) -
				(state.slots.find((s) => s.id === b.slotId)?.start ?? 0),
		);
	return (
		<>
			<PageHeading title={data.title} />
			<div className="mb-6 grid gap-4 rounded-xl border bg-white p-5 md:grid-cols-2 xl:grid-cols-4">
				<DatePicker value={date} onChange={setDate} />
				<Button
					variant="outline"
					className="md:hidden"
					onClick={() => setFilters(!filters)}
					aria-expanded={filters}
				>
					<SlidersHorizontal />
					Filters
				</Button>
				<div className={filters ? "contents" : "hidden md:contents"}>
					<SelectField
						label="Locatie"
						value={location}
						onChange={(v) => {
							setLocation(v);
							setField("all");
						}}
						options={[
							{ value: "all", label: "Alle locaties" },
							...state.locations.map((l) => ({ value: l.id, label: l.name })),
						]}
					/>
					<SelectField
						label="Veld"
						value={field}
						onChange={setField}
						options={[
							{ value: "all", label: "Alle velden" },
							...state.fields
								.filter((f) => location === "all" || f.locationId === location)
								.map((f) => ({ value: f.id, label: f.name })),
						]}
					/>
					<SelectField
						label="Status"
						value={status}
						onChange={setStatus}
						options={[
							{ value: "all", label: "Alle statussen" },
							{ value: "confirmed", label: "Bevestigd" },
							{ value: "pending", label: "Wacht op betaling" },
							{ value: "checking", label: "Betaling wordt gecontroleerd" },
							{ value: "cancelled", label: "Geannuleerd" },
							{ value: "failed", label: "Betaling mislukt" },
						]}
					/>
				</div>
			</div>
			<StateBoundary>
				<BookingTable bookings={bookings} />
			</StateBoundary>
		</>
	);
}
