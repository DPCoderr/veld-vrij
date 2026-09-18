import {
	ArrowLeft,
	Check,
	Copy,
	Info,
	KeyRound,
	LoaderCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppLink } from "#/components/shared/app-link";
import { PageHeading } from "#/components/shared/page-heading";
import { EmptyState, StateBoundary } from "#/components/shared/state-boundary";
import { StatusBadge } from "#/components/shared/status-badge";
import { Button } from "#/components/ui/button";
import data from "#/features/demo/data/pages/reserveringsdetail.json";
import { useDemo } from "#/features/demo/demo-provider";
import { canCancel, slotStart } from "#/features/demo/model";
import { dateLabel, demoMinutes, hour, money, timeRange } from "#/lib/format";
import { BookingSummary } from "./booking-summary";
import { CancelDialog } from "./cancel-dialog";
import { PaymentDialog } from "./payment-dialog";
export function BookingDetailPage({ id }: { id: string }) {
	const { state } = useDemo();
	const [cancel, setCancel] = useState(
		state.scenario === "cancel" || state.scenario === "late-cancel",
	);
	const [pay, setPay] = useState(false);
	const [copied, setCopied] = useState(false);
	const booking = state.bookings.find((b) => b.id === id);
	const slot = state.slots.find((s) => s.id === booking?.slotId);
	const field = state.fields.find((f) => f.id === slot?.fieldId);
	const location = state.locations.find((l) => l.id === field?.locationId);
	if (!booking || !slot)
		return (
			<div className="page-wrap py-12">
				<EmptyState
					title="Reservering niet gevonden"
					description="Open een reservering vanuit Mijn reserveringen of kies een scenario op het demo-overzicht."
				/>
				<Button asChild className="mt-5">
					<AppLink to="/demo">Demo-overzicht</AppLink>
				</Button>
			</div>
		);
	const expired = demoMinutes(state.now) >= slotStart(slot) + 60;
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(booking.code);
			setCopied(true);
			toast.success("Toegangscode gekopieerd");
		} catch {
			toast.error(
				"Kopiëren lukt niet. Selecteer de code om deze zelf te kopiëren.",
			);
		}
	};
	return (
		<div className="page-wrap py-8 md:py-12">
			<AppLink
				to="/mijn-reserveringen"
				className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground"
			>
				<ArrowLeft className="size-4" />
				Mijn reserveringen
			</AppLink>
			<PageHeading
				title={
					booking.status === "checking"
						? "We controleren je betaling"
						: data.title
				}
				action={<StatusBadge status={booking.status} />}
			/>
			<StateBoundary>
				<div className="grid items-start gap-7 md:grid-cols-2">
					<div className="order-2 space-y-5 md:order-1">
						<BookingSummary slot={slot} sport={booking.sport} />
						<div className="rounded-xl border bg-white p-6">
							<h2 className="font-semibold">Locatie en betaling</h2>
							<p className="mt-3 text-sm text-muted-foreground">
								{location?.address}
							</p>
							<p className="mt-4 text-sm">
								{booking.paid
									? `Betaald · ${money(slot.price)}`
									: slot.price === 0
										? "Je hoeft niet te betalen."
										: "Nog niet betaald"}
							</p>
							{booking.refund === "processing" && (
								<p className="mt-3 text-sm text-amber-800">
									Terugbetaling wordt verwerkt.
								</p>
							)}
							{canCancel(state, booking) && (
								<Button
									variant="outline"
									className="mt-5 border-destructive/40 text-destructive"
									onClick={() => setCancel(true)}
								>
									Reservering annuleren
								</Button>
							)}
						</div>
					</div>
					<div className="order-1 md:order-2">
						{booking.status === "confirmed" ? (
							<section className="rounded-xl border bg-white p-4 md:p-8">
								<div className="mb-4 flex items-center gap-3">
									<KeyRound className="text-primary" />
									<h2 className="text-xl font-semibold">Jouw toegangscode</h2>
								</div>
								<p className="my-4 select-all rounded-lg bg-green-50 py-4 text-center font-mono text-[clamp(2rem,10vw,3.4rem)] font-semibold tracking-wide text-primary md:my-6 md:py-6">
									{booking.code.slice(0, 4)} {booking.code.slice(4)}
								</p>
								<Button
									variant="outline"
									className="w-full text-primary"
									onClick={() => void copy()}
								>
									{copied ? <Check /> : <Copy />}
									{copied ? "Gekopieerd" : "Kopieer code"}
								</Button>
								<p className="mt-4 text-sm font-semibold">
									{dateLabel(slot.date)} · {timeRange(slot.start)}
								</p>
								<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
									{expired
										? "Deze toegangscode is verlopen."
										: `Vanaf ${hour(slot.start)} geldig. Om ${hour(slot.start + 1)} vervalt je toegang.`}
								</p>
								<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
									Je kunt binnen dit tijdslot opnieuw naar binnen.
								</p>
								<p className="mt-3 flex gap-2 border-t pt-3 text-sm text-muted-foreground">
									<Info className="size-5 shrink-0" />
									Gebruik deze code voor toegang tot het gereserveerde veld.
								</p>
							</section>
						) : (
							<section
								aria-live="polite"
								className="rounded-xl border bg-white p-8"
							>
								{booking.status === "checking" ? (
									<>
										<LoaderCircle className="mb-5 size-10 animate-spin text-primary" />
										<h2 className="text-xl font-semibold">
											Betaling wordt gecontroleerd
										</h2>
										<p className="mt-3 leading-relaxed text-muted-foreground">
											Dit kan even duren. Je reservering is bevestigd zodra de
											betaling is verwerkt.
										</p>
										<Button variant="outline" className="mt-6" asChild>
											<AppLink to="/mijn-reserveringen">
												Mijn reserveringen
											</AppLink>
										</Button>
									</>
								) : booking.status === "cancelled" ? (
									<>
										<h2 className="text-xl font-semibold">
											Je reservering is geannuleerd
										</h2>
										<p className="mt-3 text-muted-foreground">
											Je toegangscode is niet meer geldig.
										</p>
										<Button className="mt-6" asChild>
											<AppLink to="/sportplekken">
												Vind een nieuw moment
											</AppLink>
										</Button>
									</>
								) : (
									<>
										<h2 className="text-xl font-semibold">
											{booking.status === "failed"
												? "De betaling is niet gelukt"
												: "Rond je betaling af"}
										</h2>
										<p className="mt-3 text-muted-foreground">
											Je ontvangt je toegangscode zodra je reservering is
											bevestigd.
										</p>
										<Button className="mt-6" onClick={() => setPay(true)}>
											{booking.status === "failed"
												? "Opnieuw betalen"
												: "Verder naar betalen"}
										</Button>
									</>
								)}
							</section>
						)}
					</div>
				</div>
			</StateBoundary>
			<CancelDialog booking={booking} open={cancel} onOpenChange={setCancel} />
			<PaymentDialog id={booking.id} open={pay} onOpenChange={setPay} />
		</div>
	);
}
