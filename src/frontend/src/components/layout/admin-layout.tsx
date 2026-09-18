import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { AppSidebar } from "#/components/app-sidebar";
import { Button } from "#/components/ui/button";
import {
	SidebarInset,
	SidebarProvider,
	useSidebar,
} from "#/components/ui/sidebar";
import { Brand } from "./brand";

function AdminHeader() {
	const { toggleSidebar } = useSidebar();
	return (
		<header className="flex h-14 shrink-0 items-center justify-between border-b bg-white px-4 md:h-[72px] min-[1025px]:justify-end min-[1025px]:px-8">
			<div className="min-[1025px]:hidden">
				<Brand />
			</div>
			<span className="hidden text-sm text-muted-foreground min-[1025px]:block">
				VeldVrij Beheer
			</span>
			<Button
				variant="outline"
				className="min-[1025px]:hidden"
				onClick={toggleSidebar}
			>
				<Menu />
				Menu
			</Button>
		</header>
	);
}
export function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="min-w-0 bg-background">
				<AdminHeader />
				<main
					id="main"
					className="mx-auto w-full max-w-[1200px] p-4 py-6 sm:p-8 xl:p-12"
				>
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
