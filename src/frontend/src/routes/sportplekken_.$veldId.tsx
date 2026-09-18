import { createFileRoute } from "@tanstack/react-router";
import { FieldDetailPage } from "#/features/fields/field-detail-page";
export const Route = createFileRoute("/sportplekken_/$veldId")({
	component: Page,
});
function Page() {
	const { veldId } = Route.useParams();
	return <FieldDetailPage key={veldId} id={veldId} />;
}
