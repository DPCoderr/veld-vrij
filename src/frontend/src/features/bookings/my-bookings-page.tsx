import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { useState } from "react";
import { AppLink } from "#/components/shared/app-link";
import { PageHeading } from "#/components/shared/page-heading";
import { EmptyState, StateBoundary } from "#/components/shared/state-boundary";
import { StatusBadge } from "#/components/shared/status-badge";
import { Button } from "#/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
import data from "#/features/demo/data/pages/mijn-reserveringen.json";
import { useDemo } from "#/features/demo/demo-provider";
import { slotStart } from "#/features/demo/model";
import { dateLabel, demoMinutes, price, timeRange } from "#/lib/format";
export function MyBookingsPage() {
	const { state } = useDemo();
	const [tab, setTab] = useState("upcoming");
	const bookings = state.bookings
		.filter((b) => b.owner === "sam")
		.filter((b) => {
			const s = state.slots.find((s) => s.id === b.slotId);
			return (
				s &&
				(tab === "upcoming"
					? slotStart(s) + 60 > demoMinutes(state.now)
					: slotStart(s) + 60 <= demoMinutes(state.now))
			);
		});
	return (
		<div className="page-wrap py-6 md:py-12">
			<PageHeading title={data.title} />
			<Tabs value={tab} onValueChange={setTab} className="mb-6">
				<TabsList>
					<TabsTrigger value="upcoming">Aankomend</TabsTrigger>
					<TabsTrigger value="past">Eerder</TabsTrigger>
				</TabsList>
			</Tabs>
			<StateBoundary>
				{bookings.length ? (
					<div className="space-y-5">
						{bookings.map((b) => {
							const slot = state.slots.find((s) => s.id === b.slotId);
							const field = state.fields.find((f) => f.id === slot?.fieldId);
							if (!slot || !field) return null;
							return (
								<article
									key={b.id}
									className="flex flex-col gap-3 rounded-xl border bg-white p-3 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
								>
									<img
										src={field.image}
										alt={field.name}
										width={1672}
										height={941}
										className="h-24 w-full rounded-lg object-cover sm:h-32 sm:w-44"
									/>
									<div className="flex-1">
										<div className="flex flex-wrap items-start justify-between gap-3">
											<h2 className="text-xl font-bold">{field.name}</h2>
											<StatusBadge status={b.status} />
										</div>
										<p className="mt-1 text-sm text-muted-foreground">
											{b.sport}
										</p>
										<div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
											<span className="flex items-center gap-2">
												<CalendarDays className="size-4 text-muted-foreground" />
												{dateLabel(slot.date)}
											</span>
											<span className="flex items-center gap-2">
												<Clock3 className="size-4 text-muted-foreground" />
												{timeRange(slot.start)}
											</span>
										</div>
										<div className="mt-4 flex flex-wrap items-center justify-between gap-3">
											<span className="text-sm text-muted-foreground">
												{b.refund === "processing"
													? "Terugbetaling wordt verwerkt"
													: (b.paid ? "Betaald · " : "") + price(slot.price)}
											</span>
											<Button variant="outline" asChild>
												<AppLink to={`/reserveringen/${b.id}`}>
													{b.status === "pending"
														? "Rond betaling af"
														: "Bekijk reservering"}
													<ArrowRight />
												</AppLink>
											</Button>
										</div>
									</div>
								</article>
							);
						})}
					</div>
				) : (
					<EmptyState
						title="Nog geen reserveringen"
						description="Kies een sportplek en plan jouw volgende moment buiten."
					/>
				)}
			</StateBoundary>
		</div>
	);
}
