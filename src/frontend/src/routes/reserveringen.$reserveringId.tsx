import { createFileRoute } from "@tanstack/react-router";
import { BookingDetailPage } from "#/features/bookings/booking-detail-page";
export const Route = createFileRoute("/reserveringen/$reserveringId")({
	component: Page,
});
function Page() {
	const { reserveringId } = Route.useParams();
	return <BookingDetailPage key={reserveringId} id={reserveringId} />;
}
