import { Info, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "#/components/data-table";
import { DatePicker } from "#/components/shared/date-picker";
import { PageHeading } from "#/components/shared/page-heading";
import { SelectField } from "#/components/shared/select-field";
import { StateBoundary } from "#/components/shared/state-boundary";
import { StatusBadge } from "#/components/shared/status-badge";
import { Button } from "#/components/ui/button";
import data from "#/features/demo/data/pages/planning.json";
import { useDemo } from "#/features/demo/demo-provider";
import { activeBooking } from "#/features/demo/model";
import type { Slot } from "#/features/demo/types";
import { dateLabel, price, timeRange } from "#/lib/format";
import { CloseSlotDialog } from "./close-slot-dialog";
export function PlanningPage() {
	const { state, dispatch } = useDemo();
	const [location, setLocation] = useState("buiten");
	const [fieldId, setFieldId] = useState(data.selectedFieldId);
	const [date, setDate] = useState(data.date);
	const [close, setClose] = useState<string | null>(
		state.scenario === "close-slot" ? data.selectedSlotId : null,
	);
	const field = state.fields.find((f) => f.id === fieldId);
	const slots = state.slots
		.filter((s) => s.fieldId === fieldId && s.date === date)
		.sort((a, b) => a.start - b.start);
	const closing = state.slots.find((s) => s.id === close);
	return (
		<>
			<PageHeading
				title={data.title}
				description={data.description}
				action={
					<Button
						disabled={!field}
						onClick={() => {
							dispatch({ type: "generate", fieldId, date });
							toast.success(
								"Tijdsloten bijgewerkt. Bestaande slots zijn behouden.",
							);
						}}
					>
						<Plus />
						Tijdsloten genereren
					</Button>
				}
			/>
			<div className="mb-6 grid gap-4 rounded-xl border bg-white p-5 lg:grid-cols-3">
				<SelectField
					label="Locatie"
					value={location}
					onChange={(id) => {
						setLocation(id);
						setFieldId(
							state.fields.find((f) => f.locationId === id)?.id ?? "none",
						);
					}}
					options={state.locations.map((l) => ({ value: l.id, label: l.name }))}
				/>
				<SelectField
					label="Veld"
					value={fieldId}
					onChange={setFieldId}
					options={state.fields
						.filter((f) => f.locationId === location)
						.map((f) => ({ value: f.id, label: f.name }))}
				/>
				<DatePicker value={date} onChange={setDate} />
			</div>
			{field && field.sports.length > 1 && (
				<p className="mb-7 flex gap-3 rounded-lg border border-primary/20 bg-green-50/50 p-4 text-sm">
					<Info className="size-5 shrink-0 text-primary" />
					Voetbal en basketbal delen deze tijdsloten.
				</p>
			)}
			<h2 className="mb-5 text-xl font-bold">{dateLabel(date)}</h2>
			<StateBoundary>
				<DataTable
					rows={slots}
					renderMobile={(s) => (
						<div className="space-y-3">
							<div className="flex items-center justify-between gap-3">
								<strong>{timeRange(s.start)}</strong>
								<span>{price(s.price)}</span>
							</div>
							<div className="flex items-center justify-between gap-3">
								<StatusBadge
									status={
										s.closed
											? "closed"
											: activeBooking(state, s.id)
												? "occupied"
												: "available"
									}
								/>
								<Button
									variant="outline"
									aria-label={
										(s.closed ? "Heropenen " : "Sluiten ") + timeRange(s.start)
									}
									onClick={() => {
										if (s.closed) {
											dispatch({ type: "reopen", slotId: s.id });
											toast.success("Tijdslot heropend");
										} else setClose(s.id);
									}}
								>
									{s.closed ? "Heropenen" : "Sluiten"}
								</Button>
							</div>
						</div>
					)}
					columns={[
						{
							key: "time",
							label: "Tijd",
							render: (s: Slot) => (
								<span className="font-semibold">{timeRange(s.start)}</span>
							),
						},
						{ key: "price", label: "Prijs", render: (s) => price(s.price) },
						{
							key: "status",
							label: "Status",
							render: (s) => (
								<StatusBadge
									status={
										s.closed
											? "closed"
											: activeBooking(state, s.id)
												? "occupied"
												: "available"
									}
								/>
							),
						},
						{
							key: "action",
							label: "Actie",
							render: (s) => (
								<Button
									variant="outline"
									aria-label={
										(s.closed ? "Heropenen " : "Sluiten ") + timeRange(s.start)
									}
									onClick={() => {
										if (s.closed) {
											dispatch({ type: "reopen", slotId: s.id });
											toast.success("Tijdslot heropend");
										} else setClose(s.id);
									}}
								>
									{s.closed ? "Heropenen" : "Sluiten"}
								</Button>
							),
						},
					]}
				/>
			</StateBoundary>
			{closing && (
				<CloseSlotDialog
					key={closing.id}
					slot={closing}
					onClose={() => setClose(null)}
				/>
			)}
		</>
	);
}
