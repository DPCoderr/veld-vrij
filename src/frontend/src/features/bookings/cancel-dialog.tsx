import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { useDemo } from "#/features/demo/demo-provider";
import { refundAmount } from "#/features/demo/model";
import type { Booking } from "#/features/demo/types";
import { dateLabel, money, timeRange } from "#/lib/format";
export function CancelDialog({
	booking,
	open,
	onOpenChange,
}: {
	booking: Booking;
	open: boolean;
	onOpenChange: (v: boolean) => void;
}) {
	const { state, dispatch } = useDemo();
	const slot = state.slots.find((s) => s.id === booking.slotId);
	const field = state.fields.find((f) => f.id === slot?.fieldId);
	const refund = refundAmount(state, booking);
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<div className="mx-auto rounded-full bg-red-50 p-3 text-destructive">
					<Trash2 className="size-6" />
				</div>
				<AlertDialogHeader>
					<AlertDialogTitle>Reservering annuleren?</AlertDialogTitle>
					<AlertDialogDescription>
						{field?.name}
						<br />
						{slot && `${dateLabel(slot.date)} · ${timeRange(slot.start)}`}
					</AlertDialogDescription>
				</AlertDialogHeader>
				{slot?.price !== 0 && booking.paid && (
					<p className="rounded-lg bg-muted p-4 font-semibold">
						{refund
							? `Je ontvangt ${money(refund)} terug.`
							: "Je ontvangt geen terugbetaling."}
					</p>
				)}
				<p className="text-sm leading-relaxed text-muted-foreground">
					Je toegangscode vervalt zodra je annuleert.
					{refund > 0 && " De terugbetaling wordt daarna verwerkt."}
				</p>
				<AlertDialogFooter>
					<AlertDialogCancel>Reservering behouden</AlertDialogCancel>
					<AlertDialogAction
						className="bg-destructive hover:bg-destructive/90"
						onClick={() => {
							dispatch({ type: "cancel", id: booking.id });
							toast.success("Reservering geannuleerd");
						}}
					>
						Ja, annuleren
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
