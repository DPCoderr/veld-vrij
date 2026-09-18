import { useNavigate, useSearch } from "@tanstack/react-router";
import {
	ArrowRight,
	Info,
	Lightbulb,
	MapPin,
	Sprout,
	UsersRound,
} from "lucide-react";
import { useState } from "react";
import { AppLink } from "#/components/shared/app-link";
import { DatePicker } from "#/components/shared/date-picker";
import { SelectField } from "#/components/shared/select-field";
import { EmptyState, StateBoundary } from "#/components/shared/state-boundary";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Label } from "#/components/ui/label";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import data from "#/features/demo/data/pages/velddetail.json";
import { useDemo } from "#/features/demo/demo-provider";
import { activeBooking, slotStart } from "#/features/demo/model";
import type { Sport } from "#/features/demo/types";
import { demoMinutes, price, timeRange } from "#/lib/format";
import { cn } from "#/lib/utils";
export function FieldDetailPage({ id }: { id: string }) {
	const { state } = useDemo();
	const navigate = useNavigate();
	const search = useSearch({ from: "__root__" });
	const field = state.fields.find((f) => f.id === id);
	const [sport, setSport] = useState(
		search.sport && field?.sports.includes(search.sport)
			? search.sport
			: (field?.sports[0] ?? "Voetbal"),
	);
	const [date, setDate] = useState(search.date ?? data.date);
	const [selected, setSelected] = useState(
		id === data.selectedFieldId ? data.selectedSlotId : "",
	);
	if (!field)
		return (
			<div className="page-wrap py-12">
				<EmptyState title="Sportplek niet gevonden" />
			</div>
		);
	const location = state.locations.find((l) => l.id === field.locationId);
	const slots = state.slots
		.filter((s) => s.fieldId === id && s.date === date)
		.sort((a, b) => a.start - b.start);
	const unavailable = (slot: (typeof slots)[number]) =>
		slot.closed ||
		!!activeBooking(state, slot.id) ||
		demoMinutes(state.now) >= slotStart(slot) ||
		!field.active ||
		!location?.active;
	const selectedSlot = slots.find((s) => s.id === selected && !unavailable(s));
	const next = () => {
		if (selectedSlot)
			void navigate({
				to:
					state.role === "guest"
						? "/inloggen"
						: `/reserveren/${selectedSlot.id}`,
				search: (prev) => ({
					...prev,
					sport,
					returnTo:
						state.role === "guest"
							? `/reserveren/${selectedSlot.id}`
							: undefined,
				}),
			});
	};
	return (
		<div className="page-wrap py-4 pb-28 md:py-10">
			<nav
				aria-label="Broodkruimel"
				className="mb-3 text-sm text-muted-foreground md:mb-5"
			>
				<AppLink to="/sportplekken">Sportplekken</AppLink>
				<span className="px-3">/</span>
				{field.name}
			</nav>
			<img
				src={field.image}
				alt={field.name}
				width={1672}
				height={941}
				className="h-[120px] w-full rounded-xl object-cover md:h-[260px]"
			/>
			<div className="my-4 md:my-6">
				<h1 className="text-3xl font-bold tracking-tight md:text-4xl">
					{field.name}
				</h1>
				<p className="mt-2 flex items-center gap-2 text-muted-foreground">
					<MapPin className="size-5" />
					{location?.name}
				</p>
				<div className="mt-3 flex gap-2">
					{field.sports.map((s) => (
						<Badge variant="secondary" key={s}>
							{s}
						</Badge>
					))}
				</div>
			</div>
			<StateBoundary>
				<div className="grid items-start gap-8 md:grid-cols-[1.3fr_1fr]">
					<section className="order-2 md:order-1">
						<h2 className="text-2xl font-bold">{data.title}</h2>
						<p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
							{field.description}
						</p>
						<div className="my-7 grid gap-5 sm:grid-cols-2">
							{[
								[Sprout, field.surface],
								[UsersRound, `Maximaal ${field.capacity} personen`],
								[
									Lightbulb,
									field.lighting ? "Verlichting" : "Geen verlichting",
								],
								[MapPin, location?.address ?? ""],
							].map(([Icon, text]) => {
								const Element = Icon as typeof Sprout;
								return (
									<div key={String(text)} className="flex items-center gap-3">
										<span className="rounded-full bg-primary/10 p-3">
											<Element className="size-5 text-primary" />
										</span>
										<span className="text-sm">{String(text)}</span>
									</div>
								);
							})}
						</div>
						<div className="border-t pt-5">
							<h3 className="mb-3 font-semibold">Goed om te weten</h3>
							<dl className="space-y-4 text-sm">
								<div>
									<dt className="font-medium">Eén veld, één groep</dt>
									<dd className="mt-1 text-muted-foreground">
										Je reserveert het hele veld voor jouw groep. Sporten op dit
										veld delen dezelfde beschikbaarheid.
									</dd>
								</div>
								<div>
									<dt className="font-medium">Reserveer per uur</dt>
									<dd className="mt-1 text-muted-foreground">
										Elk tijdslot duurt 60 minuten. Je toegangscode werkt tijdens
										je geboekte uur.
									</dd>
								</div>
								<div>
									<dt className="font-medium">Annuleren</dt>
									<dd className="mt-1 text-muted-foreground">
										Annuleer tot de start. Tot en met 60 minuten vóór de start
										ontvang je het volledige bedrag terug; daarna is er geen
										terugbetaling.
									</dd>
								</div>
							</dl>
						</div>
					</section>
					<section
						aria-label="Boeking kiezen"
						className="order-1 rounded-xl border bg-white p-4 md:order-2 md:-mt-28 md:p-6"
					>
						<h2 className="mb-4 text-xl font-bold md:text-2xl">
							Kies je moment
						</h2>
						<div className="space-y-3 md:space-y-5">
							<SelectField
								label="Sport"
								value={sport}
								onChange={(v) => setSport(v as Sport)}
								options={field.sports.map((s) => ({ value: s, label: s }))}
							/>
							<DatePicker
								value={date}
								onChange={(v) => {
									setDate(v);
									setSelected("");
								}}
							/>
							<fieldset>
								<legend className="mb-3 text-sm font-medium">
									Beschikbare tijden
								</legend>
								<RadioGroup
									value={selectedSlot?.id ?? ""}
									onValueChange={setSelected}
									className="gap-2"
								>
									{slots.map((slot) => (
										<Label
											key={slot.id}
											htmlFor={slot.id}
											className={cn(
												"flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2",
												selectedSlot?.id === slot.id &&
													"border-primary bg-green-50",
												unavailable(slot) &&
													"cursor-not-allowed bg-muted/70 text-muted-foreground",
											)}
										>
											<RadioGroupItem
												id={slot.id}
												value={slot.id}
												disabled={unavailable(slot)}
											/>
											<span>{timeRange(slot.start)}</span>
											<span className="ml-auto text-sm">
												{slot.closed
													? "Onderhoud"
													: activeBooking(state, slot.id)
														? "Bezet"
														: demoMinutes(state.now) >= slotStart(slot)
															? "Verlopen"
															: price(slot.price)}
											</span>
										</Label>
									))}
								</RadioGroup>
								{!slots.length && (
									<p className="text-sm text-muted-foreground">
										Geen tijdsloten op deze datum. Kies een andere dag.
									</p>
								)}
							</fieldset>
							{field.sports.length > 1 && (
								<p className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
									<Info className="size-5 shrink-0 text-primary" />
									{data.description}
								</p>
							)}
							<div className="hidden border-t pt-5 md:block">
								<div className="mb-4 flex justify-between">
									<span>Totaal</span>
									<strong>
										{selectedSlot ? price(selectedSlot.price) : "Kies een tijd"}
									</strong>
								</div>
								<Button
									className="w-full"
									onClick={next}
									disabled={!selectedSlot}
								>
									Verder
									<ArrowRight />
								</Button>
							</div>
						</div>
					</section>
				</div>
			</StateBoundary>
			<div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 border-t bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-lg md:hidden">
				<strong className="text-xl">
					{selectedSlot ? price(selectedSlot.price) : "Kies een tijd"}
				</strong>
				<Button className="min-w-40" onClick={next} disabled={!selectedSlot}>
					Verder
					<ArrowRight />
				</Button>
			</div>
		</div>
	);
}
