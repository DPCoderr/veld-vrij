import type { ReactNode } from "react";
export function PageHeading({
	title,
	description,
	action,
}: {
	title: string;
	description?: string;
	action?: ReactNode;
}) {
	return (
		<div className="mb-5 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
			<div>
				<h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
					{title}
				</h1>
				{description && (
					<p className="mt-2 text-muted-foreground">{description}</p>
				)}
			</div>
			{action}
		</div>
	);
}
