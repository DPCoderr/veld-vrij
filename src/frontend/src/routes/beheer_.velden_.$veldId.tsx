import { createFileRoute } from "@tanstack/react-router";
import { FieldEditorPage } from "#/features/admin/field-editor-page";
export const Route = createFileRoute("/beheer_/velden_/$veldId")({
	component: Page,
});
function Page() {
	const { veldId } = Route.useParams();
	return <FieldEditorPage key={veldId} id={veldId} />;
}
