import { ArrowRight, CircleAlert } from "lucide-react";
import { SectionCards } from "#/components/section-cards";
import { AppLink } from "#/components/shared/app-link";
import { PageHeading } from "#/components/shared/page-heading";
import { StateBoundary } from "#/components/shared/state-boundary";
import { Button } from "#/components/ui/button";
import data from "#/features/demo/data/pages/beheer-overzicht.json";
import { useDemo } from "#/features/demo/demo-provider";
import { BookingTable } from "./booking-table";
export function DashboardPage() {
	const { state } = useDemo();
	const bookings = state.bookings.filter(
		(b) => state.slots.find((s) => s.id === b.slotId)?.date === data.date,
	);
	const attention = bookings.filter((b) => b.refund === "processing").length;
	const visible = ["res-buiten-14", "res-parkzicht-16", "res-noord-18"]
		.map((id) => bookings.find((b) => b.id === id))
		.filter((b) => b !== undefined);
	return (
		<>
			<PageHeading title={data.title} description={data.description} />
			<StateBoundary>
				<SectionCards />
				{attention > 0 && (
					<div className="my-7 flex flex-wrap items-center gap-4 rounded-xl border border-amber-200 bg-amber-50/70 p-5">
						<CircleAlert className="size-7 text-amber-600" />
						<div className="flex-1">
							<p className="font-semibold">
								{attention} terugbetaling vraagt aandacht
							</p>
							<p className="mt-1 text-sm text-muted-foreground">
								Bekijk de reserveringen en onderneem actie.
							</p>
						</div>
						<Button variant="outline" asChild>
							<AppLink to="/beheer/reserveringen">
								Bekijk reservering
								<ArrowRight />
							</AppLink>
						</Button>
					</div>
				)}
				<h2 className="mt-10 mb-5 text-2xl font-bold">Boekingen vandaag</h2>
				<BookingTable bookings={visible} compact />
			</StateBoundary>
		</>
	);
}
