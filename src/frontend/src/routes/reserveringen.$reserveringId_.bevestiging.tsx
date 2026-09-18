import { createFileRoute } from "@tanstack/react-router";
import { ConfirmationPage } from "#/features/bookings/confirmation-page";
export const Route = createFileRoute(
	"/reserveringen/$reserveringId_/bevestiging",
)({ component: Page });
function Page() {
	const { reserveringId } = Route.useParams();
	return <ConfirmationPage key={reserveringId} id={reserveringId} />;
}
