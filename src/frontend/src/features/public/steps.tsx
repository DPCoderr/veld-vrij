const steps = [
	["Kies een veld", "Vind een sportplek die bij je past."],
	["Reserveer een tijd", "Boek het hele veld voor jouw groep."],
	["Ga sporten", "Gebruik je toegangscode tijdens je boeking."],
];
export function Steps() {
	return (
		<ol className="grid gap-7 md:grid-cols-3">
			{steps.map(([title, text], i) => (
				<li key={title} className="flex items-center gap-4">
					<span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
						{i + 1}
					</span>
					<div>
						<h2 className="font-bold">{title}</h2>
						<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
							{text}
						</p>
					</div>
				</li>
			))}
		</ol>
	);
}
