import { nl } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Calendar } from "#/components/ui/calendar";
import { Label } from "#/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { dateLabel } from "#/lib/format";
export function DatePicker({
	value,
	onChange,
}: {
	value: string;
	onChange: (v: string) => void;
}) {
	const [open, setOpen] = useState(false);
	const date = new Date(`${value}T12:00:00`);
	return (
		<div className="min-w-0 space-y-2">
			<Label>Datum</Label>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						aria-label="Datum kiezen"
						className="w-full justify-start font-normal"
					>
						<CalendarDays className="shrink-0" />
						<span className="truncate">{dateLabel(value, false)}</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent align="start" className="w-auto p-0">
					<Calendar
						mode="single"
						locale={nl}
						selected={date}
						defaultMonth={date}
						onSelect={(d) => {
							if (d) {
								onChange(
									`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
								);
								setOpen(false);
							}
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
