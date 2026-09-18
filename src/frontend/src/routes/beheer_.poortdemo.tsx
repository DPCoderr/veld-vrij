import { createFileRoute } from "@tanstack/react-router";
import { GatePage } from "#/features/admin/gate-page";
export const Route = createFileRoute("/beheer_/poortdemo")({ component: Page });
function Page() {
	return <GatePage />;
}
