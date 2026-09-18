import { cn } from "#/lib/utils";

export function EntityPreview({
	image,
	title,
	subtitle,
	card = false,
}: {
	image: string;
	title: string;
	subtitle?: string;
	card?: boolean;
}) {
	return (
		<div className={cn("flex gap-3", card ? "flex-col" : "items-center")}>
			<img
				src={image}
				alt=""
				width={1672}
				height={941}
				loading="lazy"
				className={cn(
					"rounded-lg object-cover",
					card ? "h-24 w-full" : "h-12 w-16 shrink-0",
				)}
			/>
			<div>
				<p className="font-semibold">{title}</p>
				{subtitle && (
					<p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
				)}
			</div>
		</div>
	);
}
