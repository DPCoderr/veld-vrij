import { Badge } from "#/components/ui/badge";
import { cn } from "#/lib/utils";

const labels: Record<string, string> = {
	confirmed: "Bevestigd",
	pending: "Wacht op betaling",
	checking: "Betaling wordt gecontroleerd",
	failed: "Betaling mislukt",
	cancelled: "Geannuleerd",
	available: "Beschikbaar",
	occupied: "Bezet",
	closed: "Onderhoud",
	active: "Actief",
	inactive: "Inactief",
	paid: "Betaald",
	processing: "Wordt verwerkt",
	refunded: "Terugbetaald",
};
export function StatusBadge({ status }: { status: string }) {
	const green = [
		"confirmed",
		"available",
		"active",
		"paid",
		"refunded",
	].includes(status);
	const amber = ["pending", "checking", "processing", "closed"].includes(
		status,
	);
	return (
		<Badge
			variant="secondary"
			className={cn(
				"gap-1.5 rounded-full border-0 px-2.5 py-1 font-medium whitespace-normal",
				green
					? "bg-green-100 text-green-800"
					: amber
						? "bg-amber-50 text-amber-900"
						: "bg-slate-100 text-slate-600",
			)}
		>
			<span
				aria-hidden
				className={cn(
					"size-1.5 shrink-0 rounded-full",
					green ? "bg-green-600" : amber ? "bg-amber-500" : "bg-slate-400",
				)}
			/>
			{labels[status] ?? status}
		</Badge>
	);
}
