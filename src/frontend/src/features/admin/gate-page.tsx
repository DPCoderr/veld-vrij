import { useForm } from "@tanstack/react-form";
import { CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { PageHeading } from "#/components/shared/page-heading";
import { SelectField } from "#/components/shared/select-field";
import { StateBoundary } from "#/components/shared/state-boundary";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import data from "#/features/demo/data/pages/poortdemo.json";
import { useDemo } from "#/features/demo/demo-provider";
import { checkAccess } from "#/features/demo/model";
import { dateLabel } from "#/lib/format";
import { cn } from "#/lib/utils";
export function GatePage() {
	const { state, dispatch } = useDemo();
	const preset =
		state.scenario === "gate-allowed" || state.scenario === "gate-denied";
	const [result, setResult] = useState<boolean | null>(
		preset ? state.scenario === "gate-allowed" : null,
	);
	const form = useForm({
		defaultValues: {
			fieldId:
				state.scenario === "gate-denied"
					? "tennisbaan-parkzicht"
					: data.selectedFieldId,
			code: preset ? "48371902" : "",
		},
		validators: {
			onSubmit: z.object({
				fieldId: z.string(),
				code: z
					.string()
					.regex(
						/^\d{8}$/,
						"Vul een toegangscode van precies acht cijfers in.",
					),
			}),
		},
		onSubmit: ({ value }) => {
			setResult(checkAccess(state, value.fieldId, value.code));
			dispatch({ type: "attempt", ...value });
		},
	});
	return (
		<>
			<PageHeading
				title={data.title}
				description={data.description}
				action={
					<Badge variant="secondary" className="self-start">
						Simulatie
					</Badge>
				}
			/>
			<StateBoundary>
				<div className="mx-auto max-w-[640px]">
					<form
						className="space-y-4 rounded-xl border bg-white p-4 md:p-6"
						onSubmit={(e) => {
							e.preventDefault();
							void form.handleSubmit();
						}}
					>
						<form.Field name="fieldId">
							{(f) => (
								<SelectField
									label="Veld"
									value={f.state.value}
									onChange={(v) => {
										f.handleChange(v);
										setResult(null);
									}}
									options={state.fields.map((f) => ({
										value: f.id,
										label: f.name,
									}))}
								/>
							)}
						</form.Field>
						<form.Field name="code">
							{(f) => (
								<Field>
									<FieldLabel htmlFor="access-code">
										Achtcijferige toegangscode
									</FieldLabel>
									<Input
										id="access-code"
										inputMode="numeric"
										autoComplete="off"
										maxLength={8}
										className="h-14 font-mono text-2xl! tracking-[0.2em]"
										value={f.state.value}
										onChange={(e) => {
											f.handleChange(e.target.value);
											setResult(null);
										}}
										aria-invalid={f.state.meta.errors.length > 0}
										aria-describedby="code-error"
									/>
									<FieldDescription
										id="code-error"
										className="text-destructive"
									>
										{f.state.meta.errors.map((e) => e?.message).join(" ")}
									</FieldDescription>
								</Field>
							)}
						</form.Field>
						<Button className="w-full" type="submit">
							Controleer toegang
						</Button>
						{result !== null && (
							<section
								aria-live="polite"
								className={cn(
									"mt-4 flex items-start gap-3 rounded-xl border p-4",
									result
										? "border-green-200 bg-green-50"
										: "border-red-200 bg-red-50",
								)}
							>
								{result ? (
									<CircleCheck className="size-9 shrink-0 text-primary" />
								) : (
									<CircleX className="size-9 shrink-0 text-destructive" />
								)}
								<div>
									<h2
										className={cn(
											"text-lg font-bold",
											result ? "text-primary" : "text-destructive",
										)}
									>
										{result ? "Toegang toegestaan" : "Toegang geweigerd"}
									</h2>
									<p className="mt-1 text-sm">
										{result
											? "Deze code is geldig voor dit veld."
											: "Deze code geeft geen toegang tot dit veld."}
									</p>
									<p className="mt-2 text-xs text-muted-foreground">
										{dateLabel(state.now.slice(0, 10), false)} ·{" "}
										{state.now.slice(11)}
									</p>
								</div>
							</section>
						)}
					</form>
					<section className="mt-9">
						<h2 className="mb-4 text-lg font-semibold">Recente pogingen</h2>
						{state.attempts.length ? (
							<ul className="divide-y rounded-xl border bg-white px-5">
								{state.attempts.map((a) => (
									<li
										key={a.id}
										className="flex flex-wrap justify-between gap-2 py-4 text-sm"
									>
										<span>
											{a.time} · {a.fieldName}
										</span>
										<span
											className={
												a.allowed ? "text-primary" : "text-destructive"
											}
										>
											{a.allowed ? "Toegestaan" : "Geweigerd"}
										</span>
									</li>
								))}
							</ul>
						) : (
							<p className="text-sm text-muted-foreground">
								Nog geen pogingen in deze sessie.
							</p>
						)}
					</section>
				</div>
			</StateBoundary>
		</>
	);
}
