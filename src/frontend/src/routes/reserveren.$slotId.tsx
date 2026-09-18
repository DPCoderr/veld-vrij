import { createFileRoute } from "@tanstack/react-router";
import { CheckoutPage } from "#/features/bookings/checkout-page";
export const Route = createFileRoute("/reserveren/$slotId")({
	component: Page,
});
function Page() {
	const { slotId } = Route.useParams();
	return <CheckoutPage key={slotId} id={slotId} />;
}
