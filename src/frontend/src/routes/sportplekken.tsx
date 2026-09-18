import { createFileRoute } from "@tanstack/react-router";
import { FieldsPage } from "#/features/fields/fields-page";
export const Route = createFileRoute("/sportplekken")({ component: Page });
function Page() {
	return <FieldsPage />;
}
