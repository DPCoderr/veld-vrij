import { createFileRoute } from "@tanstack/react-router";
import { BookingsAdminPage } from "#/features/admin/bookings-admin-page";
export const Route = createFileRoute("/beheer_/reserveringen")({
	component: Page,
});
function Page() {
	return <BookingsAdminPage />;
}
