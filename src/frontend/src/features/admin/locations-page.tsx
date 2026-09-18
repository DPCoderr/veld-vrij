import { Plus } from "lucide-react";
import { useState } from "react";
import { DataTable } from "#/components/data-table";
import { EntityPreview } from "#/components/shared/entity-preview";
import { PageHeading } from "#/components/shared/page-heading";
import { StateBoundary } from "#/components/shared/state-boundary";
import { StatusBadge } from "#/components/shared/status-badge";
import { Button } from "#/components/ui/button";
import data from "#/features/demo/data/pages/locaties.json";
import { useDemo } from "#/features/demo/demo-provider";
import type { Location } from "#/features/demo/types";
import { LocationDialog } from "./location-dialog";
export function LocationsPage() {
	const { state } = useDemo();
	const [edit, setEdit] = useState<Location | null | undefined>(undefined);
	return (
		<>
			<PageHeading
				title={data.title}
				description={data.description}
				action={
					<Button onClick={() => setEdit(null)}>
						<Plus />
						Locatie toevoegen
					</Button>
				}
			/>
			<StateBoundary>
				<DataTable
					rows={state.locations}
					renderMobile={(l) => (
						<>
							<EntityPreview
								card
								image={
									state.fields.find((f) => f.locationId === l.id)?.image ??
									"/images/multifield.png"
								}
								title={l.name}
								subtitle={l.address}
							/>
							<div className="my-3 flex items-center justify-between text-sm">
								<span>
									{state.fields.filter((f) => f.locationId === l.id).length}{" "}
									{state.fields.filter((f) => f.locationId === l.id).length ===
									1
										? "veld"
										: "velden"}
								</span>
								<StatusBadge status={l.active ? "active" : "inactive"} />
							</div>
							<Button
								className="w-full"
								variant="outline"
								onClick={() => setEdit(l)}
							>
								Bewerken
							</Button>
						</>
					)}
					columns={[
						{
							key: "name",
							label: "Naam",
							render: (l: Location) => (
								<EntityPreview
									image={
										state.fields.find((f) => f.locationId === l.id)?.image ??
										"/images/multifield.png"
									}
									title={l.name}
								/>
							),
						},
						{ key: "address", label: "Adres", render: (l) => l.address },
						{
							key: "fields",
							label: "Velden",
							render: (l) =>
								state.fields.filter((f) => f.locationId === l.id).length,
						},
						{
							key: "status",
							label: "Status",
							render: (l) => (
								<StatusBadge status={l.active ? "active" : "inactive"} />
							),
						},
						{
							key: "action",
							label: "Actie",
							render: (l) => (
								<Button variant="outline" onClick={() => setEdit(l)}>
									Bewerken
								</Button>
							),
						},
					]}
				/>
			</StateBoundary>
			{edit !== undefined && (
				<LocationDialog
					key={edit?.id ?? "new"}
					location={edit}
					onClose={() => setEdit(undefined)}
				/>
			)}
		</>
	);
}
