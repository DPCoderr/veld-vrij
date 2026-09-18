import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { StateBoundary } from "#/components/shared/state-boundary";
import { Button } from "#/components/ui/button";
import data from "#/features/demo/data/pages/home.json";
import { useDemo } from "#/features/demo/demo-provider";
import type { Sport } from "#/features/demo/types";
import { FieldCard } from "#/features/fields/field-card";
import { FieldFilters } from "#/features/fields/field-filters";
import { Steps } from "./steps";
export function HomePage() {
	const { state } = useDemo();
	const navigate = useNavigate();
	const [filters, setFilters] = useState({
		sport: "all",
		location: "all",
		date: data.date,
	});
	return (
		<>
			<section className="relative">
				<img
					src="/images/football.png"
					alt="Groen voetbalveld omringd door bomen"
					fetchPriority="high"
					width={1672}
					height={941}
					className="absolute inset-0 h-full w-full object-cover object-[65%_50%]"
				/>
				<div className="absolute inset-0 bg-linear-to-r from-[#f7f9f6]/95 via-[#f7f9f6]/70 to-transparent" />
				<div className="page-wrap relative pb-10 pt-12 md:pb-8 md:pt-16">
					<div className="max-w-xl">
						<h1 className="text-[40px] leading-[1.1] font-extrabold tracking-[-1.7px] md:text-[52px]">
							Jouw sportplek.
							<br />
							Jouw moment.
						</h1>
						<p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
							{data.description}
						</p>
					</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							void navigate({
								to: "/sportplekken",
								search: (prev) => ({
									...prev,
									date: filters.date,
									sport:
										filters.sport === "all"
											? undefined
											: (filters.sport as Sport),
									location:
										filters.location === "all" ? undefined : filters.location,
								}),
							});
						}}
						className="mt-6 grid gap-3 rounded-xl border bg-white p-4 shadow-sm md:mt-10 md:grid-cols-4 md:gap-4 md:p-6"
					>
						<FieldFilters value={filters} onChange={setFilters} />
						<Button type="submit" className="self-end">
							<Search />
							Bekijk sportplekken
						</Button>
					</form>
				</div>
			</section>
			<section className="page-wrap py-6 md:py-12">
				<Steps />
			</section>
			<section className="page-wrap pb-4">
				<div className="mb-6">
					<p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">
						VOORBEELDLOCATIES
					</p>
					<h2 className="mt-2 text-3xl font-bold tracking-tight">
						Ontdek de sportplekken
					</h2>
				</div>
				<StateBoundary>
					<div className="grid gap-6 md:grid-cols-3">
						{state.fields
							.filter(
								(f) =>
									f.active &&
									state.locations.find((l) => l.id === f.locationId)?.active,
							)
							.map((f) => (
								<FieldCard key={f.id} field={f} />
							))}
					</div>
				</StateBoundary>
			</section>
		</>
	);
}
