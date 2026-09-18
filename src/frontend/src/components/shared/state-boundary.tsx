import { useNavigate, useSearch } from "@tanstack/react-router";
import { CircleAlert, SearchX } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "#/components/ui/button";
import { Skeleton } from "#/components/ui/skeleton";
export function EmptyState({
	title = "Nog niets gevonden",
	description = "Probeer een andere datum of pas je filters aan.",
}: {
	title?: string;
	description?: string;
}) {
	return (
		<div className="rounded-xl border bg-white px-6 py-16 text-center">
			<SearchX className="mx-auto mb-4 size-9 text-muted-foreground" />
			<h2 className="text-xl font-semibold">{title}</h2>
			<p className="mt-2 text-muted-foreground">{description}</p>
		</div>
	);
}
export function StateBoundary({ children }: { children: ReactNode }) {
	const { view } = useSearch({ from: "__root__" });
	const navigate = useNavigate();
	const retry = () =>
		navigate({ to: ".", search: (prev) => ({ ...prev, view: undefined }) });
	if (view === "empty") return <EmptyState />;
	if (view === "loading")
		return (
			<div aria-live="polite" className="space-y-6">
				<p className="sr-only">Gegevens worden geladen</p>
				<Skeleton className="h-10 w-2/3" />
				<div className="grid gap-6 md:grid-cols-3">
					{[1, 2, 3].map((id) => (
						<Skeleton key={id} className="h-64 rounded-xl" />
					))}
				</div>
				<Button variant="outline" onClick={retry}>
					Laden afronden
				</Button>
			</div>
		);
	if (view === "error")
		return (
			<div role="alert" className="rounded-xl border bg-white p-10 text-center">
				<CircleAlert className="mx-auto mb-4 size-9 text-destructive" />
				<h2 className="text-xl font-semibold">Er ging iets mis</h2>
				<p className="my-3 text-muted-foreground">
					We konden de gegevens niet laden. Probeer het opnieuw.
				</p>
				<Button onClick={retry}>Opnieuw proberen</Button>
			</div>
		);
	return children;
}
