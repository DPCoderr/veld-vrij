import { useNavigate } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { useDemo } from "#/features/demo/demo-provider";
export function PaymentDialog({
	id,
	open,
	onOpenChange,
}: {
	id: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { dispatch } = useDemo();
	const navigate = useNavigate();
	const finish = (outcome: "confirmed" | "failed" | "checking") => {
		dispatch({ type: "payment", id, outcome });
		onOpenChange(false);
		void navigate({
			to: `/reserveringen/${id}`,
			search: (prev) => ({ ...prev, view: undefined }),
		});
	};
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Betaling simuleren</DialogTitle>
					<DialogDescription>
						Dit is een demo. Er wordt geen geld afgeschreven. Kies het resultaat
						van de betaling.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-3 pt-3">
					<Button onClick={() => finish("confirmed")}>Betaling geslaagd</Button>
					<Button variant="outline" onClick={() => finish("checking")}>
						Betaling wordt gecontroleerd
					</Button>
					<Button variant="outline" onClick={() => finish("failed")}>
						Betaling mislukt
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
