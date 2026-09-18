import { type DataColumn, DataTable } from "#/components/data-table";
import { StatusBadge } from "#/components/shared/status-badge";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import { useDemo } from "#/features/demo/demo-provider";
import type { Booking } from "#/features/demo/types";
import { dateLabel, price, timeRange } from "#/lib/format";
export function BookingTable({
	bookings,
	compact = false,
}: {
	bookings: Booking[];
	compact?: boolean;
}) {
	const { state } = useDemo();
	const columns: DataColumn<Booking>[] = [
		{
			key: "time",
			label: "Tijd",
			render: (b: Booking) => {
				const s = state.slots.find((s) => s.id === b.slotId);
				return s ? timeRange(s.start) : "—";
			},
		},
		{
			key: "field",
			label: "Veld",
			render: (b: Booking) =>
				state.fields.find(
					(f) => f.id === state.slots.find((s) => s.id === b.slotId)?.fieldId,
				)?.name,
		},
		{ key: "name", label: "Boeker", render: (b: Booking) => b.name },
		{
			key: "status",
			label: compact ? "Status" : "Reservering",
			render: (b: Booking) => <StatusBadge status={b.status} />,
		},
	];
	if (!compact)
		columns.push(
			{
				key: "payment",
				label: "Betaling",
				render: (b: Booking) =>
					b.paid
						? "Betaald"
						: state.slots.find((s) => s.id === b.slotId)?.price === 0
							? "Gratis"
							: "Open",
			},
			{
				key: "refund",
				label: "Terugbetaling",
				render: (b: Booking) =>
					b.refund === "none" ? "—" : <StatusBadge status={b.refund} />,
			},
		);
	columns.push({
		key: "action",
		label: "Details",
		render: (b: Booking) => {
			const s = state.slots.find((s) => s.id === b.slotId);
			return (
				<Dialog>
					<DialogTrigger asChild>
						<Button
							variant="ghost"
							aria-label={`Bekijk reservering van ${b.name}`}
						>
							Bekijken
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Reservering van {b.name}</DialogTitle>
							<DialogDescription>
								{s && `${dateLabel(s.date)} · ${timeRange(s.start)}`}
							</DialogDescription>
						</DialogHeader>
						<StatusBadge status={b.status} />
						<p>
							{state.fields.find((f) => f.id === s?.fieldId)?.name} · {b.sport}
						</p>
						<p>
							{s && price(s.price)} · {b.paid ? "Betaald" : "Niet betaald"}
						</p>
						{b.refund !== "none" && (
							<p>
								Terugbetaling:{" "}
								{b.refund === "processing" ? "wordt verwerkt" : "terugbetaald"}.
							</p>
						)}
					</DialogContent>
				</Dialog>
			);
		},
	});
	return (
		<DataTable
			rows={bookings}
			columns={columns}
			label="Reserveringen"
			renderMobile={(b) => {
				const slot = state.slots.find((s) => s.id === b.slotId);
				const field = state.fields.find((f) => f.id === slot?.fieldId);
				return (
					<>
						{!compact && field && (
							<img
								src={field.image}
								alt=""
								width={1672}
								height={941}
								loading="lazy"
								className="mb-3 h-24 w-full rounded-lg object-cover"
							/>
						)}
						<div className="flex flex-wrap items-center justify-between gap-2">
							<strong>
								{compact && slot ? timeRange(slot.start) : field?.name}
							</strong>
							<StatusBadge status={b.status} />
						</div>
						{compact ? (
							<p className="mt-2 text-sm">
								{field?.name}
								<span className="block text-muted-foreground">{b.name}</span>
							</p>
						) : (
							<dl className="mt-4 space-y-2">
								{columns
									.filter((c) => !["field", "status", "action"].includes(c.key))
									.map((c) => (
										<div
											key={c.key}
											className="flex items-center justify-between gap-2 text-sm"
										>
											<dt className="text-muted-foreground">{c.label}</dt>
											<dd>{c.render(b)}</dd>
										</div>
									))}
							</dl>
						)}
						<div className="mt-2 flex justify-end">
							{columns.find((c) => c.key === "action")?.render(b)}
						</div>
					</>
				);
			}}
		/>
	);
}
