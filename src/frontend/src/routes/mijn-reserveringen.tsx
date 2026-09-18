import { createFileRoute } from "@tanstack/react-router";
import { MyBookingsPage } from "#/features/bookings/my-bookings-page";
export const Route = createFileRoute("/mijn-reserveringen")({
	component: Page,
});
function Page() {
	return <MyBookingsPage />;
}
