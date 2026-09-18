import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { AppLink } from "#/components/shared/app-link";
import { SelectField } from "#/components/shared/select-field";
import { Button } from "#/components/ui/button";
import { Checkbox } from "#/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Switch } from "#/components/ui/switch";
import { Textarea } from "#/components/ui/textarea";
import { useDemo } from "#/features/demo/demo-provider";
import type { Sport, Field as SportsField } from "#/features/demo/types";

const numberString = (min: number, max: number, message: string) =>
	z
		.string()
		.refine(
			(v) =>
				v.trim() !== "" &&
				Number.isFinite(Number(v)) &&
				Number(v) >= min &&
				Number(v) <= max,
			message,
		);
export function FieldEditor({ field }: { field?: SportsField }) {
	const { state, dispatch } = useDemo();
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			name: field?.name ?? "",
			location: field?.locationId ?? state.locations[0].id,
			surface: field?.surface ?? "Kunstgras",
			capacity: String(field?.capacity ?? 12),
			description: field?.description ?? "",
			image: field?.image ?? "/images/multifield.png",
			opens: String(field?.opens ?? 8),
			closes: String(field?.closes ?? 22),
			price: String((field?.defaultPrice ?? 0) / 100),
			active: field?.active ?? true,
			lighting: field?.lighting ?? true,
			football: field?.sports.includes("Voetbal") ?? true,
			tennis: field?.sports.includes("Tennis") ?? false,
			basketball: field?.sports.includes("Basketbal") ?? false,
		},
		validators: {
			onSubmit: z
				.object({
					name: z.string().trim().min(2, "Vul een veldnaam in."),
					location: z.string().min(1),
					surface: z.string().min(1, "Vul een ondergrond in."),
					capacity: numberString(
						1,
						100,
						"Vul een groepsgrootte van 1 tot 100 in.",
					).refine(
						(v) => Number.isInteger(Number(v)),
						"Gebruik een heel getal.",
					),
					description: z.string(),
					image: z.string(),
					opens: numberString(0, 23, "Kies een uur van 0 tot 23.").refine(
						(v) => Number.isInteger(Number(v)),
						"Gebruik hele uren.",
					),
					closes: numberString(1, 24, "Kies een uur van 1 tot 24.").refine(
						(v) => Number.isInteger(Number(v)),
						"Gebruik hele uren.",
					),
					price: numberString(0, 1000, "Vul een prijs van 0 tot 1000 in."),
					active: z.boolean(),
					lighting: z.boolean(),
					football: z.boolean(),
					tennis: z.boolean(),
					basketball: z.boolean(),
				})
				.refine((v) => Number(v.closes) > Number(v.opens), {
					path: ["closes"],
					message: "Sluiting moet na opening zijn.",
				})
				.refine((v) => v.football || v.tennis || v.basketball, {
					path: ["football"],
					message: "Selecteer minimaal één sport.",
				}),
		},
		onSubmit: ({ value }) => {
			const sports: Sport[] = [];
			if (value.football) sports.push("Voetbal");
			if (value.tennis) sports.push("Tennis");
			if (value.basketball) sports.push("Basketbal");
			dispatch({
				type: "save-field",
				field: {
					id: field?.id ?? `veld-${state.fields.length + 1}`,
					name: value.name,
					locationId: value.location,
					sports,
					image: value.image,
					surface: value.surface,
					capacity: Number(value.capacity),
					description: value.description,
					lighting: value.lighting,
					opens: Number(value.opens),
					closes: Number(value.closes),
					defaultPrice: Math.round(Number(value.price) * 100),
					active: value.active,
				},
			});
			toast.success("Veld opgeslagen");
			void navigate({ to: "/beheer/velden", search: (prev) => prev });
		},
	});
	const input = (
		name: "name" | "surface" | "capacity" | "opens" | "closes" | "price",
		label: string,
		type = "text",
	) => (
		<form.Field name={name}>
			{(f) => (
				<Field>
					<FieldLabel htmlFor={name}>{label}</FieldLabel>
					<Input
						id={name}
						type={type}
						step={name === "price" ? "0.01" : "1"}
						value={f.state.value}
						onBlur={f.handleBlur}
						onChange={(e) => f.handleChange(e.target.value)}
						aria-invalid={f.state.meta.errors.length > 0}
						aria-describedby={`${name}-error`}
					/>
					<FieldDescription id={`${name}-error`} className="text-destructive">
						{f.state.meta.errors.map((e) => e?.message).join(" ")}
					</FieldDescription>
				</Field>
			)}
		</form.Field>
	);
	return (
		<form
			noValidate
			onSubmit={(e) => {
				e.preventDefault();
				void form.handleSubmit();
			}}
			className="space-y-6"
		>
			<div className="grid gap-6 xl:grid-cols-2">
				<div className="space-y-6">
					<section className="space-y-4 rounded-xl border bg-white p-4 md:space-y-5 md:p-6">
						<h2 className="text-lg font-semibold">Basisgegevens</h2>
						{input("name", "Veldnaam")}
						<form.Field name="location">
							{(f) => (
								<SelectField
									label="Locatie"
									value={f.state.value}
									onChange={f.handleChange}
									options={state.locations.map((l) => ({
										value: l.id,
										label: l.name,
									}))}
								/>
							)}
						</form.Field>
						<fieldset>
							<legend className="mb-3 text-sm font-semibold">Sporten</legend>
							<div className="flex flex-wrap gap-5">
								{(
									[
										["football", "Voetbal"],
										["tennis", "Tennis"],
										["basketball", "Basketbal"],
									] as const
								).map(([name, label]) => (
									<form.Field key={name} name={name}>
										{(f) => (
											<Field className="w-auto">
												<div className="flex min-h-11 items-center gap-2">
													<Checkbox
														id={name}
														checked={f.state.value}
														onCheckedChange={(v) => f.handleChange(v === true)}
													/>
													<FieldLabel htmlFor={name}>{label}</FieldLabel>
												</div>
												<FieldDescription className="text-destructive">
													{f.state.meta.errors.map((e) => e?.message).join(" ")}
												</FieldDescription>
											</Field>
										)}
									</form.Field>
								))}
							</div>
						</fieldset>
					</section>
					<section className="space-y-4 rounded-xl border bg-white p-4 md:space-y-5 md:p-6">
						<h2 className="text-lg font-semibold">Praktische informatie</h2>
						<div className="grid grid-cols-2 gap-4">
							{input("surface", "Ondergrond")}
							{input("capacity", "Groepsgrootte", "number")}
						</div>
						<form.Field name="description">
							{(f) => (
								<Field>
									<FieldLabel htmlFor="description">Omschrijving</FieldLabel>
									<Textarea
										id="description"
										rows={3}
										value={f.state.value}
										onChange={(e) => f.handleChange(e.target.value)}
									/>
								</Field>
							)}
						</form.Field>
						<form.Field name="lighting">
							{(f) => (
								<Field orientation="horizontal">
									<Switch
										id="lighting"
										checked={f.state.value}
										onCheckedChange={f.handleChange}
									/>
									<FieldLabel htmlFor="lighting">Verlichting</FieldLabel>
								</Field>
							)}
						</form.Field>
					</section>
				</div>
				<div className="space-y-6">
					<section className="space-y-4 rounded-xl border bg-white p-4 md:space-y-5 md:p-6">
						<h2 className="text-lg font-semibold">Foto</h2>
						<form.Field name="image">
							{(f) => (
								<>
									<img
										src={f.state.value}
										alt="Geselecteerde veldfoto"
										width={1672}
										height={941}
										className="h-40 w-full rounded-lg object-cover"
									/>
									<SelectField
										label="Kies een bestaande foto"
										value={f.state.value}
										onChange={f.handleChange}
										options={[
											{ value: "/images/football.png", label: "Voetbalveld" },
											{ value: "/images/tennis.png", label: "Tennisbaan" },
											{ value: "/images/multifield.png", label: "Multiveld" },
										]}
									/>
								</>
							)}
						</form.Field>
					</section>
					<section className="space-y-4 rounded-xl border bg-white p-4 md:space-y-5 md:p-6">
						<h2 className="text-lg font-semibold">Openingstijden</h2>
						<div className="grid grid-cols-2 gap-5">
							{input("opens", "Open vanaf (uur)", "number")}
							{input("closes", "Gesloten vanaf (uur)", "number")}
						</div>
						<h2 className="text-lg font-semibold">Standaardprijs</h2>
						{input("price", "Prijs per uur (€)", "number")}
						<form.Subscribe selector={(s) => s.values.price}>
							{(value) => (
								<p className="text-sm text-muted-foreground">
									{Number(value) === 0
										? "Nieuwe tijdsloten zijn gratis reserveerbaar."
										: "Nieuwe tijdsloten gebruiken deze standaardprijs."}
									<br />
									De prijs van bestaande tijdsloten blijft gelijk.
								</p>
							)}
						</form.Subscribe>
						<form.Field name="active">
							{(f) => (
								<Field orientation="horizontal">
									<Switch
										id="active"
										checked={f.state.value}
										onCheckedChange={f.handleChange}
									/>
									<FieldLabel htmlFor="active">Actief</FieldLabel>
								</Field>
							)}
						</form.Field>
					</section>
				</div>
			</div>
			<div className="flex gap-3">
				<Button type="submit">Opslaan</Button>
				<Button variant="outline" asChild>
					<AppLink to="/beheer/velden">Annuleren</AppLink>
				</Button>
			</div>
		</form>
	);
}
