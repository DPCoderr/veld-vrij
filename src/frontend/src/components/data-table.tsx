import type { ReactNode } from "react";
import { EmptyState } from "#/components/shared/state-boundary";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
export interface DataColumn<T> {
	key: string;
	label: string;
	render: (row: T) => ReactNode;
}
export function DataTable<T extends { id: string }>({
	rows,
	columns,
	label = "Overzicht",
	renderMobile,
}: {
	rows: T[];
	columns: DataColumn<T>[];
	label?: string;
	renderMobile?: (row: T) => ReactNode;
}) {
	if (!rows.length) return <EmptyState />;
	return (
		<>
			<div className="hidden overflow-hidden rounded-xl border bg-white md:block">
				<Table aria-label={label}>
					<TableHeader>
						<TableRow>
							{columns.map((c) => (
								<TableHead
									key={c.key}
									className="h-14 px-5 text-sm text-muted-foreground"
								>
									{c.label}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map((row) => (
							<TableRow key={row.id}>
								{columns.map((c) => (
									<TableCell
										key={c.key}
										className="px-5 py-5 whitespace-normal"
									>
										{c.render(row)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<div className="space-y-4 md:hidden">
				{rows.map((row) => (
					<article
						key={row.id}
						className="rounded-xl border bg-white p-3 md:p-5"
					>
						{renderMobile ? (
							renderMobile(row)
						) : (
							<dl className="space-y-3">
								{columns.map((c) => (
									<div
										key={c.key}
										className="flex flex-wrap items-center justify-between gap-3"
									>
										<dt className="text-sm text-muted-foreground">{c.label}</dt>
										<dd className="text-right text-sm font-medium">
											{c.render(row)}
										</dd>
									</div>
								))}
							</dl>
						)}
					</article>
				))}
			</div>
		</>
	);
}
