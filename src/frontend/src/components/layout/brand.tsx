import { AppLink } from "#/components/shared/app-link";
export function Brand() {
	return (
		<div className="flex items-center gap-3">
			<AppLink
				to="/"
				className="text-[28px] font-extrabold tracking-[-1.4px] text-primary"
			>
				VeldVrij
			</AppLink>
			<AppLink
				to="/demo"
				className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
			>
				Demo
			</AppLink>
		</div>
	);
}
