import { createFileRoute } from "@tanstack/react-router";
import { PlanningPage } from "#/features/admin/planning-page";
export const Route = createFileRoute("/beheer_/planning")({ component: Page });
function Page() {
	return <PlanningPage />;
}
