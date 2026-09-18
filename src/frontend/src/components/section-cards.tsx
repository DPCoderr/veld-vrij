import { CalendarDays, CircleAlert, LockKeyhole } from "lucide-react";
import { useDemo } from "#/features/demo/demo-provider";
import { cn } from "#/lib/utils";
export function SectionCards() {
	const { state } = useDemo();
	const day = state.now.slice(0, 10);
	const bookings = state.bookings.filter(
		(b) => state.slots.find((s) => s.id === b.slotId)?.date === day,
	);
	const stats = [
		{
			icon: CalendarDays,
			label: "Boekingen vandaag",
			value: bookings.length,
			color: "bg-green-50 text-primary",
		},
		{
			icon: LockKeyhole,
			label: "Gesloten slots",
			value: state.slots.filter((s) => s.closed && s.date === day).length,
			color: "bg-slate-100 text-slate-600",
		},
		{
			icon: CircleAlert,
			label: "Openstaande terugbetalingen",
			value: bookings.filter((b) => b.refund === "processing").length,
			color: "bg-amber-50 text-amber-600",
		},
	];
	return (
		<div className="grid gap-4 xl:grid-cols-3">
			{stats.map((s) => (
				<section
					key={s.label}
					className="flex items-center gap-4 rounded-xl border bg-white p-5"
				>
					<span className={cn("rounded-full p-4", s.color)}>
						<s.icon className="size-6" />
					</span>
					<div>
						<h2 className="text-sm text-muted-foreground">{s.label}</h2>
						<p className="mt-1 text-3xl font-bold">{s.value}</p>
					</div>
				</section>
			))}
		</div>
	);
}
