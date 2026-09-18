import { useForm } from "@tanstack/react-form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { AppLink } from "#/components/shared/app-link";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import login from "#/features/demo/data/pages/inloggen.json";
import register from "#/features/demo/data/pages/registreren.json";
import { useDemo } from "#/features/demo/demo-provider";
export function AuthForm({ signup = false }: { signup?: boolean }) {
	const [visible, setVisible] = useState(false);
	const { dispatch } = useDemo();
	const search = useSearch({ from: "__root__" });
	const navigate = useNavigate();
	const data = signup ? register : login;
	const finish = () => {
		dispatch({ type: "role", role: "member" });
		void navigate({
			to: search.returnTo ?? "/mijn-reserveringen",
			search: (prev) => ({ ...prev, view: undefined, returnTo: undefined }),
		});
	};
	const form = useForm({
		defaultValues: {
			name: "",
			email: search.view === "invalid" ? "sam@" : "",
			password: "",
		},
		validators: {
			onSubmit: z.object({
				name: signup ? z.string().trim().min(2, "Vul je naam in.") : z.string(),
				email: z.email("Vul een geldig e-mailadres in."),
				password: z.string().min(8, "Gebruik minimaal 8 tekens."),
			}),
		},
		onSubmit: finish,
	});
	return (
		<Card className="w-full border-0 bg-transparent shadow-none">
			<CardHeader className="px-0">
				<CardTitle className="text-3xl font-bold tracking-tight">
					<h1>{data.title}</h1>
				</CardTitle>
				<CardDescription className="mt-2 text-base">
					{data.description}
				</CardDescription>
			</CardHeader>
			<CardContent className="px-0">
				<form
					noValidate
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						void form.handleSubmit();
					}}
				>
					<FieldGroup>
						{signup && (
							<form.Field name="name">
								{(field) => (
									<Field>
										<FieldLabel htmlFor="name">Naam</FieldLabel>
										<Input
											id="name"
											autoComplete="name"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={field.state.meta.errors.length > 0}
											aria-describedby="name-error"
										/>
										<FieldDescription
											id="name-error"
											className="text-destructive"
										>
											{field.state.meta.errors.map((e) => e?.message).join(" ")}
										</FieldDescription>
									</Field>
								)}
							</form.Field>
						)}
						<form.Field name="email">
							{(field) => (
								<Field>
									<FieldLabel htmlFor="email">E-mailadres</FieldLabel>
									<Input
										id="email"
										type="email"
										autoComplete="email"
										placeholder="jij@voorbeeld.nl"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={
											field.state.meta.errors.length > 0 ||
											(search.view === "invalid" &&
												field.state.value === "sam@")
										}
										aria-describedby="email-error"
									/>
									<FieldDescription
										id="email-error"
										className="text-destructive"
									>
										{field.state.meta.errors.map((e) => e?.message).join(" ") ||
											(search.view === "invalid" && field.state.value === "sam@"
												? "Vul een geldig e-mailadres in."
												: "")}
									</FieldDescription>
								</Field>
							)}
						</form.Field>
						<form.Field name="password">
							{(field) => (
								<Field>
									<FieldLabel htmlFor="password">Wachtwoord</FieldLabel>
									<div className="relative">
										<Input
											id="password"
											className="pr-12"
											type={visible ? "text" : "password"}
											autoComplete={
												signup ? "new-password" : "current-password"
											}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={field.state.meta.errors.length > 0}
											aria-describedby="password-error"
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute top-0 right-0"
											aria-label={
												visible ? "Wachtwoord verbergen" : "Wachtwoord tonen"
											}
											onClick={() => setVisible(!visible)}
										>
											{visible ? <EyeOff /> : <Eye />}
										</Button>
									</div>
									<FieldDescription
										id="password-error"
										className="text-destructive"
									>
										{field.state.meta.errors.map((e) => e?.message).join(" ")}
									</FieldDescription>
								</Field>
							)}
						</form.Field>
						<Button type="submit" className="w-full">
							{signup ? "Account maken" : "Inloggen"}
						</Button>
						{!signup && (
							<>
								<FieldSeparator>of</FieldSeparator>
								<Button
									type="button"
									variant="outline"
									className="w-full"
									onClick={finish}
								>
									<svg
										aria-hidden="true"
										viewBox="0 0 24 24"
										className="size-5"
									>
										<path
											fill="#4285F4"
											d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"
										/>
										<path
											fill="#34A853"
											d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.82-1.76-5.61-4.12H3.04v2.59A10 10 0 0 0 12 22Z"
										/>
										<path
											fill="#FBBC05"
											d="M6.39 13.92a6 6 0 0 1 0-3.84V7.49H3.04a10 10 0 0 0 0 9.02l3.35-2.59Z"
										/>
										<path
											fill="#EA4335"
											d="M12 5.96c1.47 0 2.79.5 3.83 1.5l2.88-2.88A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.96 5.49l3.35 2.59C7.18 7.72 9.4 5.96 12 5.96Z"
										/>
									</svg>
									Inloggen met Google
								</Button>
							</>
						)}
						<FieldDescription className="border-t pt-5 text-center">
							{signup ? "Heb je al een account? " : "Nog geen account? "}
							<AppLink
								to={signup ? "/inloggen" : "/registreren"}
								search={{ returnTo: search.returnTo }}
								className="font-semibold text-primary"
							>
								{signup ? "Inloggen" : "Registreren"}
							</AppLink>
						</FieldDescription>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
