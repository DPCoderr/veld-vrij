import { ChevronDown, Menu, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { AppLink } from "#/components/shared/app-link";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "#/components/ui/sheet";
import { useDemo } from "#/features/demo/demo-provider";
import { Brand } from "./brand";
export function PublicLayout({ children }: { children: ReactNode }) {
	const { state, dispatch } = useDemo();
	const [open, setOpen] = useState(false);
	const links = [
		["Sportplekken", "/sportplekken"],
		["Zo werkt het", "/zo-werkt-het"],
		...(state.role === "guest"
			? [["Inloggen", "/inloggen"]]
			: [["Mijn reserveringen", "/mijn-reserveringen"]]),
	];
	return (
		<>
			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-white focus:p-4"
			>
				Naar inhoud
			</a>
			<header className="border-b bg-white">
				<div className="page-wrap flex h-14 items-center justify-between md:h-[72px]">
					<Brand />
					<nav
						aria-label="Hoofdnavigatie"
						className="hidden items-center gap-8 min-[1025px]:flex"
					>
						{links.map(([name, to]) => (
							<AppLink key={to} to={to} className="text-sm hover:text-primary">
								{name}
							</AppLink>
						))}
						{state.role === "guest" ? (
							<Button asChild>
								<AppLink to="/sportplekken">Vind een sportplek</AppLink>
							</Button>
						) : (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost">
										<UserRound />
										Sam
										<ChevronDown />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem asChild>
										<AppLink to="/beheer">Beheer</AppLink>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => dispatch({ type: "role", role: "guest" })}
									>
										Uitloggen
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</nav>
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button variant="outline" className="min-[1025px]:hidden">
								<Menu />
								Menu
							</Button>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>Menu</SheetTitle>
							</SheetHeader>
							<nav className="flex flex-col gap-2 p-5">
								{[
									...links,
									["Beheer", "/beheer"],
									["Demo-overzicht", "/demo"],
								].map(([name, to]) => (
									<AppLink
										key={to}
										to={to}
										onClick={() => setOpen(false)}
										className="rounded-lg px-3 py-3 hover:bg-muted"
									>
										{name}
									</AppLink>
								))}
								{state.role !== "guest" && (
									<Button
										variant="outline"
										onClick={() => {
											dispatch({ type: "role", role: "guest" });
											setOpen(false);
										}}
									>
										Uitloggen
									</Button>
								)}
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</header>
			<main id="main" className="min-h-[calc(100svh-161px)]">
				{children}
			</main>
			<footer className="mt-16 border-t bg-white">
				<div className="page-wrap flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-muted-foreground">
					<span className="font-semibold text-primary">VeldVrij</span>
					<span>Samen naar buiten.</span>
					<AppLink to="/demo">Demo-overzicht</AppLink>
				</div>
			</footer>
		</>
	);
}
