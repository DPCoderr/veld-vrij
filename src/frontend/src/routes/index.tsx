import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "#/features/public/home-page";
export const Route = createFileRoute("/")({ component: Page });
function Page() {
	return <HomePage />;
}
