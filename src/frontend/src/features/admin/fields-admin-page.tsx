import { Plus } from "lucide-react";
import { useState } from "react";
import { DataTable } from "#/components/data-table";
import { AppLink } from "#/components/shared/app-link";
import { EntityPreview } from "#/components/shared/entity-preview";
import { PageHeading } from "#/components/shared/page-heading";
import { SelectField } from "#/components/shared/select-field";
import { StateBoundary } from "#/components/shared/state-boundary";
import { StatusBadge } from "#/components/shared/status-badge";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import data from "#/features/demo/data/pages/velden.json";
import { useDemo } from "#/features/demo/demo-provider";
import type { Field, Sport } from "#/features/demo/types";
import { price } from "#/lib/format";
export function FieldsAdminPage() {
	const { state } = useDemo();
	const [location, setLocation] = useState("all");
	const [sport, setSport] = useState("all");
	const fields = state.fields.filter(
		(f) =>
			(location === "all" || f.locationId === location) &&
			(sport === "all" || f.sports.includes(sport as Sport)),
	);
	return (
		<>
			<PageHeading
				title={data.title}
				description={data.description}
				action={
					<Button asChild>
						<AppLink to="/beheer/velden/nieuw">
							<Plus />
							Veld toevoegen
						</AppLink>
					</Button>
				}
			/>
			<div className="mb-6 grid gap-4 rounded-xl border bg-white p-5 sm:grid-cols-2">
				<SelectField
					label="Locatie"
					value={location}
					onChange={setLocation}
					options={[
						{ value: "all", label: "Alle locaties" },
						...state.locations.map((l) => ({ value: l.id, label: l.name })),
					]}
				/>
				<SelectField
					label="Sport"
					value={sport}
					onChange={setSport}
					options={[
						{ value: "all", label: "Alle sporten" },
						...["Voetbal", "Tennis", "Basketbal"].map((s) => ({
							value: s,
							label: s,
						})),
					]}
				/>
			</div>
			<StateBoundary>
				<DataTable
					rows={fields}
					renderMobile={(f) => (
						<>
							<EntityPreview
								card
								image={f.image}
								title={f.name}
								subtitle={
									f.defaultPrice
										? `Vanaf ${price(f.defaultPrice)} per uur`
										: "Gratis tijdsloten"
								}
							/>
							<p className="mt-3 text-sm text-muted-foreground">
								{state.locations.find((l) => l.id === f.locationId)?.name} ·{" "}
								{f.sports.join(", ")}
							</p>
							<div className="mt-3 flex items-center justify-between">
								<StatusBadge status={f.active ? "active" : "inactive"} />
								<Button variant="outline" asChild>
									<AppLink to={`/beheer/velden/${f.id}`}>Bewerken</AppLink>
								</Button>
							</div>
						</>
					)}
					columns={[
						{
							key: "name",
							label: "Veld",
							render: (f: Field) => (
								<EntityPreview
									image={f.image}
									title={f.name}
									subtitle={
										f.defaultPrice
											? `Vanaf ${price(f.defaultPrice)} per uur`
											: "Gratis tijdsloten"
									}
								/>
							),
						},
						{
							key: "location",
							label: "Locatie",
							render: (f) =>
								state.locations.find((l) => l.id === f.locationId)?.name,
						},
						{
							key: "sports",
							label: "Sporten",
							render: (f) => (
								<div className="flex flex-wrap gap-1">
									{f.sports.map((s) => (
										<Badge variant="secondary" key={s}>
											{s}
										</Badge>
									))}
								</div>
							),
						},
						{
							key: "status",
							label: "Status",
							render: (f) => (
								<StatusBadge status={f.active ? "active" : "inactive"} />
							),
						},
						{
							key: "action",
							label: "Actie",
							render: (f) => (
								<Button variant="outline" asChild>
									<AppLink to={`/beheer/velden/${f.id}`}>Bewerken</AppLink>
								</Button>
							),
						},
					]}
				/>
			</StateBoundary>
		</>
	);
}
