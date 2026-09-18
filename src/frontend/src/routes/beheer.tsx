import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "#/features/admin/dashboard-page";
export const Route = createFileRoute("/beheer")({ component: Page });
function Page() {
	return <DashboardPage />;
}
