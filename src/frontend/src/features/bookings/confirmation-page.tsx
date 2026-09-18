import { CircleCheck, KeyRound } from "lucide-react";
import { AppLink } from "#/components/shared/app-link";
import { EmptyState } from "#/components/shared/state-boundary";
import { StatusBadge } from "#/components/shared/status-badge";
import { Button } from "#/components/ui/button";
import { useDemo } from "#/features/demo/demo-provider";
import { hour } from "#/lib/format";
import { BookingSummary } from "./booking-summary";
export function ConfirmationPage({ id }: { id: string }) {
	const { state } = useDemo();
	const booking = state.bookings.find((b) => b.id === id);
	const slot = state.slots.find((s) => s.id === booking?.slotId);
	if (!booking || !slot || booking.status !== "confirmed")
		return (
			<div className="page-wrap py-12">
				<EmptyState title="Nog geen bevestigde reservering" />
			</div>
		);
	return (
		<div className="page-wrap py-6 md:py-12">
			<div className="mb-6 flex items-start gap-4">
				<CircleCheck className="size-10 shrink-0 rounded-full bg-green-100 p-2 text-primary" />
				<div>
					<h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
						Je reservering is bevestigd
					</h1>
					<p className="mb-3 text-muted-foreground">
						We zien je graag op het sportpark!
					</p>
					<StatusBadge status="confirmed" />
				</div>
			</div>
			<div className="grid items-start gap-5 md:grid-cols-[1.2fr_1fr] md:gap-8">
				<div className="md:order-2">
					<BookingSummary slot={slot} sport={booking.sport} />
				</div>
				<div className="space-y-5 md:order-1">
					<section className="rounded-xl border bg-white p-4 md:p-6">
						<h2 className="mb-3 font-semibold">Belangrijke informatie</h2>
						<p className="font-medium">
							{slot.price === 0
								? "Je hoeft niet te betalen."
								: "Je betaling is ontvangen."}
						</p>
						<p className="mt-3 text-sm text-muted-foreground">
							Annuleren kan tot {hour(slot.start)}. Daarna kan aanpassing niet
							meer.
						</p>
					</section>
					<section className="rounded-xl border bg-white p-4 md:p-6">
						<h2 className="mb-3 font-semibold">Wat is de volgende stap?</h2>
						<p className="mb-4 text-sm text-muted-foreground">
							Je reservering staat in je overzicht. Bekijk je toegangscode voor
							toegang tot dit veld tijdens je geboekte uur.
						</p>
						<Button asChild className="w-full">
							<AppLink to={`/reserveringen/${booking.id}`}>
								<KeyRound />
								Bekijk je toegangscode
							</AppLink>
						</Button>
						<Button asChild variant="outline" className="mt-3 w-full">
							<AppLink to="/mijn-reserveringen">Mijn reserveringen</AppLink>
						</Button>
					</section>
				</div>
			</div>
		</div>
	);
}
