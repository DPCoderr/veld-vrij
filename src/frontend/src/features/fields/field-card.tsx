import { ChevronRight, MapPin } from "lucide-react";
import { AppLink } from "#/components/shared/app-link";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { useDemo } from "#/features/demo/demo-provider";
import type { Field } from "#/features/demo/types";
import { money } from "#/lib/format";
export function FieldCard({ field }: { field: Field }) {
	const { state } = useDemo();
	const location = state.locations.find((l) => l.id === field.locationId);
	const prices = state.slots
		.filter((s) => s.fieldId === field.id)
		.map((s) => s.price);
	const minimum = prices.length ? Math.min(...prices) : field.defaultPrice;
	return (
		<article className="overflow-hidden rounded-xl border bg-white shadow-xs">
			<AppLink to={`/sportplekken/${field.id}`}>
				<img
					src={field.image}
					alt={field.name}
					width={1672}
					height={941}
					loading="lazy"
					className="h-28 w-full object-cover md:h-auto md:aspect-[1.95]"
				/>
			</AppLink>
			<div className="p-3 md:p-5">
				<h3 className="text-lg font-bold">
					<AppLink to={`/sportplekken/${field.id}`}>{field.name}</AppLink>
				</h3>
				<p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
					<MapPin className="size-4" />
					{location?.name}
				</p>
				<div className="mt-3 flex gap-2">
					{field.sports.map((s) => (
						<Badge
							key={s}
							variant="secondary"
							className="rounded-full font-normal"
						>
							{s}
						</Badge>
					))}
				</div>
				<div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3 md:mt-5 md:pt-4">
					<span className="text-sm text-muted-foreground">
						{minimum === 0 ? (
							"Gratis tijdsloten"
						) : (
							<>
								Vanaf{" "}
								<strong className="text-foreground">{money(minimum)}</strong>{" "}
								per uur
							</>
						)}
					</span>
					<Button
						variant="outline"
						asChild
						className="border-primary/60 text-primary"
					>
						<AppLink to={`/sportplekken/${field.id}`}>
							Bekijk tijden
							<ChevronRight />
						</AppLink>
					</Button>
				</div>
			</div>
		</article>
	);
}
