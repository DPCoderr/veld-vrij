import { createFileRoute } from "@tanstack/react-router";
import { HowPage } from "#/features/public/how-page";
export const Route = createFileRoute("/zo-werkt-het")({ component: Page });
function Page() {
	return <HowPage />;
}
