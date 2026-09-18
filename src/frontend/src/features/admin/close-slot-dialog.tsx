import { useState } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { useDemo } from "#/features/demo/demo-provider";
import { activeBooking, refundAmount } from "#/features/demo/model";
import type { Slot } from "#/features/demo/types";
import { dateLabel, money, timeRange } from "#/lib/format";
export function CloseSlotDialog({
	slot,
	onClose,
}: {
	slot: Slot;
	onClose: () => void;
}) {
	const { state, dispatch } = useDemo();
	const [reason, setReason] = useState(
		state.scenario === "close-slot" ? "Onderhoud aan de omheining" : "",
	);
	const booking = activeBooking(state, slot.id);
	const field = state.fields.find((f) => f.id === slot.fieldId);
	return (
		<Dialog
			open
			onOpenChange={(v) => {
				if (!v) onClose();
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Tijdslot sluiten?</DialogTitle>
					<DialogDescription>
						{field?.name}
						<br />
						{dateLabel(slot.date)} · {timeRange(slot.start)}
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-2">
					<Label htmlFor="reason">Reden</Label>
					<Textarea
						id="reason"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder="Bijvoorbeeld onderhoud aan het veld"
					/>
				</div>
				{booking && (
					<section className="space-y-2 rounded-lg bg-muted p-4 text-sm">
						<h3 className="mb-3 font-semibold">
							Gevolgen voor deze reservering
						</h3>
						<p>De reservering van {booking.name} wordt geannuleerd.</p>
						<p>De toegangscode vervalt direct.</p>
						{refundAmount(state, booking, true) > 0 && (
							<p>De boeker ontvangt {money(slot.price)} terug.</p>
						)}
					</section>
				)}
				<p className="text-sm text-muted-foreground">
					Het tijdslot blijft gesloten.
				</p>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Terug
					</Button>
					<Button
						variant="destructive"
						disabled={!reason.trim()}
						onClick={() => {
							dispatch({
								type: "close",
								slotId: slot.id,
								reason: reason.trim(),
							});
							toast.success("Tijdslot gesloten");
							onClose();
						}}
					>
						{booking ? "Sluiten en annuleren" : "Tijdslot sluiten"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
