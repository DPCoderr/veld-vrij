import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { DatePicker } from "#/components/shared/date-picker";
import { SelectField } from "#/components/shared/select-field";
import { Button } from "#/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "#/components/ui/sheet";
import { useDemo } from "#/features/demo/demo-provider";
export interface Filters {
	sport: string;
	location: string;
	date: string;
}
export function FieldFilters({
	value,
	onChange,
	compact = false,
}: {
	value: Filters;
	onChange: (v: Filters) => void;
	compact?: boolean;
}) {
	const { state } = useDemo();
	const [open, setOpen] = useState(false);
	const choices = (
		<>
			<SelectField
				label="Sport"
				value={value.sport}
				onChange={(sport) => onChange({ ...value, sport })}
				options={[
					{ value: "all", label: "Alle sporten" },
					...["Voetbal", "Tennis", "Basketbal"].map((s) => ({
						value: s,
						label: s,
					})),
				]}
			/>
			<SelectField
				label="Locatie"
				value={value.location}
				onChange={(location) => onChange({ ...value, location })}
				options={[
					{ value: "all", label: "Alle locaties" },
					...state.locations.map((l) => ({ value: l.id, label: l.name })),
				]}
			/>
		</>
	);
	return (
		<>
			<div className={compact ? "hidden md:contents" : "contents"}>
				{choices}
			</div>
			<DatePicker
				value={value.date}
				onChange={(date) => onChange({ ...value, date })}
			/>
			{compact && (
				<div className="self-end md:hidden">
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button variant="outline">
								<SlidersHorizontal />
								Filters
								{value.sport !== "all" || value.location !== "all"
									? " · actief"
									: ""}
							</Button>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>Filters</SheetTitle>
							</SheetHeader>
							<div className="space-y-6 p-5">
								{choices}
								<Button className="w-full" onClick={() => setOpen(false)}>
									Toon sportplekken
								</Button>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			)}
		</>
	);
}
