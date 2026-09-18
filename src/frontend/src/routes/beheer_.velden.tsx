import { createFileRoute } from "@tanstack/react-router";
import { FieldsAdminPage } from "#/features/admin/fields-admin-page";
export const Route = createFileRoute("/beheer_/velden")({ component: Page });
function Page() {
	return <FieldsAdminPage />;
}
