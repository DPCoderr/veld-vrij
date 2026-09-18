import { createFileRoute } from "@tanstack/react-router";
import { LocationsPage } from "#/features/admin/locations-page";
export const Route = createFileRoute("/beheer_/locaties")({ component: Page });
function Page() {
	return <LocationsPage />;
}
