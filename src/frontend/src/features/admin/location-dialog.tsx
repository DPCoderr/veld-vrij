import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Switch } from "#/components/ui/switch";
import { useDemo } from "#/features/demo/demo-provider";
import type { Location } from "#/features/demo/types";
export function LocationDialog({
	location,
	onClose,
}: {
	location: Location | null;
	onClose: () => void;
}) {
	const { state, dispatch } = useDemo();
	const form = useForm({
		defaultValues: {
			name: location?.name ?? "",
			address: location?.address ?? "",
			active: location?.active ?? true,
		},
		validators: {
			onSubmit: z.object({
				name: z.string().trim().min(2, "Vul een naam in."),
				address: z.string().trim().min(5, "Vul een volledig adres in."),
				active: z.boolean(),
			}),
		},
		onSubmit: ({ value }) => {
			dispatch({
				type: "save-location",
				location: {
					...value,
					id: location?.id ?? `locatie-${state.locations.length + 1}`,
				},
			});
			toast.success("Locatie opgeslagen");
			onClose();
		},
	});
	return (
		<Dialog
			open
			onOpenChange={(v) => {
				if (!v) onClose();
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{location ? "Locatie bewerken" : "Locatie toevoegen"}
					</DialogTitle>
					<DialogDescription>
						Geef de locatie een naam en adres.
					</DialogDescription>
				</DialogHeader>
				<form
					className="space-y-5"
					onSubmit={(e) => {
						e.preventDefault();
						void form.handleSubmit();
					}}
				>
					{(["name", "address"] as const).map((name) => (
						<form.Field key={name} name={name}>
							{(f) => (
								<Field>
									<FieldLabel htmlFor={`location-${name}`}>
										{name === "name" ? "Naam" : "Adres"}
									</FieldLabel>
									<Input
										id={`location-${name}`}
										value={f.state.value}
										onChange={(e) => f.handleChange(e.target.value)}
										onBlur={f.handleBlur}
										aria-invalid={f.state.meta.errors.length > 0}
										aria-describedby={`${name}-error`}
									/>
									<FieldDescription
										id={`${name}-error`}
										className="text-destructive"
									>
										{f.state.meta.errors.map((e) => e?.message).join(" ")}
									</FieldDescription>
								</Field>
							)}
						</form.Field>
					))}
					<form.Field name="active">
						{(f) => (
							<Field orientation="horizontal">
								<Switch
									id="location-active"
									checked={f.state.value}
									onCheckedChange={f.handleChange}
								/>
								<FieldLabel htmlFor="location-active">Actief</FieldLabel>
							</Field>
						)}
					</form.Field>
					<div className="flex justify-end gap-3">
						<Button type="button" variant="outline" onClick={onClose}>
							Annuleren
						</Button>
						<Button type="submit">Opslaan</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
