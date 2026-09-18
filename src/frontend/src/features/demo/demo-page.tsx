import { ArrowUpRight, RotateCcw } from "lucide-react";
import { useState } from "react";
import { AppLink } from "#/components/shared/app-link";
import { PageHeading } from "#/components/shared/page-heading";
import { SelectField } from "#/components/shared/select-field";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { useDemo } from "./demo-provider";
import { scenarios } from "./model";
import type { Role } from "./types";

type PageData = { id: string; title: string; route: string };
const pages = Object.values(
	import.meta.glob<PageData>("./data/pages/*.json", {
		eager: true,
		import: "default",
	}),
);
export function DemoPage() {
	const { state, dispatch } = useDemo();
	const [role, setRole] = useState("automatic");
	return (
		<div className="page-wrap py-10">
			<PageHeading
				title="Alle schermen, één overzicht"
				description="Bekijk de pagina’s en probeer verschillende situaties. Alle gegevens zijn fictief; verversen herstelt het gekozen scenario."
				action={
					<Button variant="outline" onClick={() => dispatch({ type: "reset" })}>
						<RotateCcw />
						Demo resetten
					</Button>
				}
			/>
			<section className="mb-8 grid gap-5 rounded-xl border bg-white p-5 sm:grid-cols-2">
				<SelectField
					label="Bekijken als"
					value={role}
					onChange={setRole}
					options={[
						{ value: "automatic", label: "Passend bij de pagina" },
						{ value: "guest", label: "Bezoeker" },
						{ value: "member", label: "Sam · Sporter" },
						{ value: "admin", label: "Sam · Beheerder" },
					]}
				/>
				<div className="space-y-2">
					<Label htmlFor="demo-time">Tijd in de huidige demo</Label>
					<Input
						id="demo-time"
						type="datetime-local"
						value={state.now}
						onChange={(e) => {
							if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(e.target.value))
								dispatch({ type: "time", now: e.target.value });
						}}
					/>
				</div>
			</section>
			<h2 className="mb-5 text-2xl font-bold">Pagina’s</h2>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{pages.map((p) => {
					const scenario =
						p.id === "poortdemo"
							? "gate-allowed"
							: p.route.startsWith("/beheer")
								? "admin"
								: ["reserveringsdetail", "mijn-reserveringen"].includes(p.id)
									? "confirmed"
									: "browse";
					const search = {
						scenario,
						role: role === "automatic" ? undefined : (role as Role),
					};
					return (
						<article key={p.id} className="rounded-xl border bg-white p-5">
							<AppLink
								to={p.route}
								search={search}
								onClick={() => dispatch({ type: "reset" })}
								className="flex min-h-12 items-center justify-between gap-3 font-semibold"
							>
								{p.title}
								<ArrowUpRight className="size-5 shrink-0 text-primary" />
							</AppLink>
							<div className="mt-3 flex flex-wrap gap-3 border-t pt-4 text-xs text-muted-foreground">
								{(
									[
										"loading",
										"empty",
										"error",
										...(["inloggen", "registreren"].includes(p.id)
											? ["invalid" as const]
											: []),
									] as const
								).map((view) => (
									<AppLink
										key={view}
										to={p.route}
										search={{ ...search, view }}
										className="py-2 underline underline-offset-4"
									>
										{
											{
												loading: "Laden",
												empty: "Leeg",
												error: "Fout",
												invalid: "Validatie",
											}[view]
										}
									</AppLink>
								))}
							</div>
						</article>
					);
				})}
			</div>
			<h2 className="mt-12 mb-5 text-2xl font-bold">Bijzondere situaties</h2>
			<div className="grid gap-4 sm:grid-cols-2">
				{[
					...scenarios,
					{
						id: "gate-allowed",
						title: "Toegang toegestaan",
						path: "/beheer/poortdemo",
					},
					{
						id: "late-cancel",
						title: "Annuleren zonder terugbetaling",
						path: "/reserveringen/res-buiten-14",
					},
				].map((s) => (
					<AppLink
						key={s.id}
						to={s.path}
						search={{
							scenario: s.id,
							view: undefined,
							role: role === "automatic" ? undefined : (role as Role),
						}}
						onClick={() => dispatch({ type: "reset" })}
						className="flex items-center justify-between gap-4 rounded-xl border bg-white p-5 font-medium"
					>
						{s.title}
						<ArrowUpRight className="size-5 shrink-0 text-primary" />
					</AppLink>
				))}
			</div>
		</div>
	);
}
