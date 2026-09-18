import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock3, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AppLink } from "#/components/shared/app-link";
import { PageHeading } from "#/components/shared/page-heading";
import { EmptyState, StateBoundary } from "#/components/shared/state-boundary";
import { Alert, AlertDescription } from "#/components/ui/alert";
import { Button } from "#/components/ui/button";
import data from "#/features/demo/data/pages/afronden.json";
import { useDemo } from "#/features/demo/demo-provider";
import { activeBooking, slotStart } from "#/features/demo/model";
import { demoMinutes, hour } from "#/lib/format";
import { BookingSummary } from "./booking-summary";
import { PaymentDialog } from "./payment-dialog";
export function CheckoutPage({ id }: { id: string }) {
	const { state, dispatch } = useDemo();
	const search = useSearch({ from: "__root__" });
	const navigate = useNavigate();
	const [pay, setPay] = useState(false);
	const slot = state.slots.find((s) => s.id === id);
	const field = state.fields.find((f) => f.id === slot?.fieldId);
	const sport =
		search.sport && field?.sports.includes(search.sport)
			? search.sport
			: (field?.sports[0] ?? "Voetbal");
	if (!slot || !field)
		return (
			<div className="page-wrap py-12">
				<EmptyState title="Tijdslot niet gevonden" />
			</div>
		);
	const existing = activeBooking(state, id);
	const unavailable =
		slot.closed ||
		!field.active ||
		!state.locations.find((l) => l.id === field.locationId)?.active ||
		(existing && existing.owner !== "sam") ||
		demoMinutes(state.now) >= slotStart(slot);
	const confirm = () => {
		if (state.role === "guest") {
			void navigate({
				to: "/inloggen",
				search: (prev) => ({ ...prev, returnTo: `/reserveren/${id}`, sport }),
			});
			return;
		}
		dispatch({ type: "book", slotId: id, sport });
		if (slot.price === 0)
			void navigate({
				to: `/reserveringen/res-${id}/bevestiging`,
				search: (prev) => ({ ...prev, view: undefined }),
			});
		else setPay(true);
	};
	return (
		<div className="page-wrap py-6 md:py-12">
			<AppLink
				to={`/sportplekken/${field.id}`}
				className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground"
			>
				<ArrowLeft className="size-4" />
				Terug naar het veld
			</AppLink>
			<PageHeading title={data.title} />
			<StateBoundary>
				<div className="grid gap-7 md:grid-cols-[1.2fr_1fr]">
					<div className="order-2 md:order-1">
						<section className="rounded-xl border bg-white p-6">
							<div className="mb-4 flex items-center gap-3">
								<ShieldCheck className="size-6 text-primary" />
								<h2 className="text-xl font-semibold">Goed om te weten</h2>
							</div>
							<p className="leading-relaxed text-muted-foreground">
								{data.description} Je toegangscode is geldig tijdens je
								gereserveerde uur.
							</p>
							<div className="mt-6 border-t pt-5">
								<h3 className="font-semibold">Annuleren</h3>
								<p className="mt-3">
									{slot.price === 0
										? `Annuleren kan tot ${hour(slot.start)}.`
										: "Gratis annuleren tot en met " +
											hour(slot.start - 1) +
											"."}
								</p>
								{slot.price > 0 && (
									<p className="mt-2 leading-relaxed text-muted-foreground">
										Daarna kun je tot {hour(slot.start)} annuleren zonder
										terugbetaling.
									</p>
								)}
							</div>
						</section>
					</div>
					<div className="order-1 md:order-2">
						<BookingSummary slot={slot} sport={sport}>
							{slot.price > 0 && (
								<Alert className="my-4 border-green-200 bg-green-50">
									<Clock3 />
									<AlertDescription>
										Je tijdslot blijft nog 08:42 voor je gereserveerd.
									</AlertDescription>
								</Alert>
							)}
							{unavailable ? (
								<Alert variant="destructive" className="mt-5">
									<AlertDescription>
										Dit tijdslot is niet meer beschikbaar. Kies een ander
										moment.
									</AlertDescription>
								</Alert>
							) : (
								<div className="mt-4">
									<Button size="lg" className="w-full" onClick={confirm}>
										{slot.price === 0
											? "Gratis reserveren"
											: "Verder naar betalen"}
										<ArrowRight />
									</Button>
									<p className="mt-3 text-center text-sm text-muted-foreground">
										{slot.price === 0
											? "Je hoeft niet te betalen."
											: "Je betaalt via Stripe Checkout. In deze demo simuleren we de betaling."}
									</p>
								</div>
							)}
						</BookingSummary>
					</div>
				</div>
			</StateBoundary>
			<PaymentDialog id={`res-${id}`} open={pay} onOpenChange={setPay} />
		</div>
	);
}
