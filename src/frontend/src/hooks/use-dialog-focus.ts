import { useRef } from "react";

/** Also restores focus for controlled dialogs opened without a Radix Trigger. */
export function useDialogFocus(
	onOpen?: (event: Event) => void,
	onClose?: (event: Event) => void,
) {
	const previous = useRef<HTMLElement | null>(null);
	return {
		onOpenAutoFocus(event: Event) {
			previous.current =
				document.activeElement instanceof HTMLElement
					? document.activeElement
					: null;
			onOpen?.(event);
		},
		onCloseAutoFocus(event: Event) {
			onClose?.(event);
			if (!event.defaultPrevented && previous.current?.isConnected) {
				event.preventDefault();
				previous.current.focus();
			}
		},
	};
}
