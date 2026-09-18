import { CalendarDays, KeyRound, MapPin } from "lucide-react";
import { PageHeading } from "#/components/shared/page-heading";
import { StateBoundary } from "#/components/shared/state-boundary";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion";
import data from "#/features/demo/data/pages/zo-werkt-het.json";

const steps = [
	{
		icon: MapPin,
		title: "Kies een sportplek",
		text: "Bekijk velden, sporten en beschikbare tijden.",
	},
	{
		icon: CalendarDays,
		title: "Reserveer je tijd",
		text: "Boek een uur. Gratis tijdsloten bevestig je direct.",
	},
	{
		icon: KeyRound,
		title: "Gebruik je toegangscode",
		text: "Je code werkt alleen tijdens je boeking.",
	},
];
const questions = [
	[
		"Zijn er gratis tijdsloten?",
		"Ja. Bij gratis tijdsloten sla je de betaalstap over.",
	],
	[
		"Hoe betaal ik?",
		"Betaalde tijdsloten reken je af via Stripe Checkout. In deze demo wordt de betaling gesimuleerd.",
	],
	[
		"Tot wanneer kan ik annuleren?",
		"Je kunt tot de start annuleren. Tot en met 60 minuten vóór de start ontvang je het volledige bedrag terug. Daarna is er geen terugbetaling.",
	],
	[
		"Kan ik opnieuw naar binnen?",
		"Ja. Je toegangscode werkt tijdens het gereserveerde uur voor jouw veld. Op de eindtijd vervalt je toegang.",
	],
];
export function HowPage() {
	return (
		<div className="page-wrap py-6 md:py-12">
			<PageHeading title={data.title} description={data.description} />
			<StateBoundary>
				<div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
					<ol className="my-4 grid gap-6 lg:grid-cols-3">
						{steps.map((s, i) => (
							<li key={s.title} className="flex items-center gap-4 lg:block">
								<div className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary lg:mb-4">
									<s.icon className="size-7" />
									<span className="absolute -top-2 right-0 flex size-5 items-center justify-center rounded-full bg-secondary text-xs font-bold">
										{i + 1}
									</span>
								</div>
								<div>
									<h2 className="font-semibold">{s.title}</h2>
									<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
										{s.text}
									</p>
								</div>
							</li>
						))}
					</ol>
					<img
						src="/images/multifield.png"
						alt="Een sportveld in het groen"
						width={1672}
						height={941}
						className="h-40 w-full rounded-xl object-cover object-center lg:h-64"
					/>
				</div>
				<section className="mt-8">
					<h2 className="mb-5 text-2xl font-bold">Veelgestelde vragen</h2>
					<Accordion type="single" collapsible defaultValue="0">
						{questions.map(([q, a], i) => (
							<AccordionItem
								value={String(i)}
								key={q}
								className="mb-2 rounded-lg border bg-white px-4"
							>
								<AccordionTrigger className="py-4 text-sm">
									{q}
								</AccordionTrigger>
								<AccordionContent className="text-base leading-relaxed text-muted-foreground">
									{a}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</section>
			</StateBoundary>
		</div>
	);
}
