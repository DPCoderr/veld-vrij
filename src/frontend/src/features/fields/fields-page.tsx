import { useNavigate, useSearch } from "@tanstack/react-router";
import { PageHeading } from "#/components/shared/page-heading";
import { EmptyState, StateBoundary } from "#/components/shared/state-boundary";
import { Button } from "#/components/ui/button";
import data from "#/features/demo/data/pages/sportplekken.json";
import { useDemo } from "#/features/demo/demo-provider";
import type { Sport } from "#/features/demo/types";
import { FieldCard } from "./field-card";
import { FieldFilters } from "./field-filters";
export function FieldsPage() {
	const { state } = useDemo();
	const search = useSearch({ from: "__root__" });
	const navigate = useNavigate();
	const filters = {
		sport: search.sport ?? "all",
		location: search.location ?? "all",
		date: search.date ?? data.date,
	};
	const fields = state.fields.filter(
		(f) =>
			f.active &&
			state.locations.find((l) => l.id === f.locationId)?.active &&
			(filters.sport === "all" || f.sports.includes(filters.sport as Sport)) &&
			(filters.location === "all" || f.locationId === filters.location) &&
			state.slots.some((s) => s.fieldId === f.id && s.date === filters.date),
	);
	return (
		<div className="page-wrap py-6 md:py-12">
			<PageHeading title={data.title} description={data.description} />
			<div className="mb-4 grid grid-cols-[1fr_auto] gap-3 rounded-xl border bg-white p-3 md:mb-7 md:grid-cols-3 md:gap-4 md:p-5">
				<FieldFilters
					compact
					value={filters}
					onChange={(v) =>
						void navigate({
							to: ".",
							search: (prev) => ({
								...prev,
								sport: v.sport === "all" ? undefined : (v.sport as Sport),
								location: v.location === "all" ? undefined : v.location,
								date: v.date,
							}),
						})
					}
				/>
			</div>
			<div className="mb-5 flex items-center justify-between">
				<p className="font-medium">{fields.length} sportplekken gevonden</p>
				<Button
					variant="ghost"
					onClick={() =>
						void navigate({
							to: ".",
							search: (prev) => ({
								...prev,
								sport: undefined,
								location: undefined,
								date: data.date,
							}),
						})
					}
				>
					Wis filters
				</Button>
			</div>
			<StateBoundary>
				{fields.length ? (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{fields.map((f) => (
							<FieldCard key={f.id} field={f} />
						))}
					</div>
				) : (
					<EmptyState />
				)}
			</StateBoundary>
		</div>
	);
}
