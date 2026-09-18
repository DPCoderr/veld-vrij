import { useId } from "react";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
export function SelectField({
	label,
	value,
	onChange,
	options,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	options: { value: string; label: string }[];
}) {
	const id = useId();
	return (
		<div className="min-w-0 space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger id={id} className="w-full bg-white">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{options.map((o) => (
						<SelectItem key={o.value} value={o.value}>
							{o.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
