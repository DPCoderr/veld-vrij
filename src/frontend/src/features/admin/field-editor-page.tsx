import { PageHeading } from "#/components/shared/page-heading";
import { EmptyState, StateBoundary } from "#/components/shared/state-boundary";
import data from "#/features/demo/data/pages/veldbeheer.json";
import { useDemo } from "#/features/demo/demo-provider";
import { FieldEditor } from "./field-editor";
export function FieldEditorPage({ id }: { id: string }) {
	const { state } = useDemo();
	const field = state.fields.find((f) => f.id === id);
	if (!field && id !== "nieuw")
		return <EmptyState title="Veld niet gevonden" />;
	return (
		<>
			<PageHeading title={id === "nieuw" ? "Veld toevoegen" : data.title} />
			<StateBoundary>
				<FieldEditor key={id} field={field} />
			</StateBoundary>
		</>
	);
}
