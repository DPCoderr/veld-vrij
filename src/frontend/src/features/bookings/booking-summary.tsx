import { CalendarDays, Clock3, MapPin, UsersRound } from "lucide-react";
import type { ReactNode } from "react";
import { useDemo } from "#/features/demo/demo-provider";
import type { Slot, Sport } from "#/features/demo/types";
import { dateLabel, price, timeRange } from "#/lib/format";
export function BookingSummary({
	slot,
	sport,
	showPrice = true,
	children,
}: {
	slot: Slot;
	sport: Sport;
	showPrice?: boolean;
	children?: ReactNode;
}) {
	const { state } = useDemo();
	const field = state.fields.find((f) => f.id === slot.fieldId);
	const location = state.locations.find((l) => l.id === field?.locationId);
	if (!field) return null;
	return (
		<section className="overflow-hidden rounded-xl border bg-white">
			<img
				src={field.image}
				alt={field.name}
				width={1672}
				height={941}
				className="h-28 w-full object-cover md:h-44"
			/>
			<div className="p-4 md:p-6">
				<h2 className="text-xl font-bold">{field.name}</h2>
				<p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
					<MapPin className="size-4" />
					{location?.name}
				</p>
				<dl className="mt-4 space-y-2 text-sm md:mt-6 md:space-y-4">
					<div className="flex gap-3">
						<UsersRound className="size-5 text-muted-foreground" />
						<dt className="sr-only">Sport</dt>
						<dd>{sport} · Hele veld</dd>
					</div>
					<div className="flex gap-3">
						<CalendarDays className="size-5 text-muted-foreground" />
						<dt className="sr-only">Datum</dt>
						<dd>{dateLabel(slot.date)}</dd>
					</div>
					<div className="flex gap-3">
						<Clock3 className="size-5 text-muted-foreground" />
						<dt className="sr-only">Tijd</dt>
						<dd>{timeRange(slot.start)} · 60 minuten</dd>
					</div>
				</dl>
				{showPrice && (
					<div className="mt-4 flex justify-between border-t pt-3 md:mt-6 md:pt-5">
						<span>Totaal</span>
						<strong className="text-xl">{price(slot.price)}</strong>
					</div>
				)}
				{children}
			</div>
		</section>
	);
}
