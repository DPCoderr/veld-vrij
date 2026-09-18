import { useLocation } from "@tanstack/react-router";
import {
	ArrowLeft,
	CalendarDays,
	ClipboardList,
	DoorOpen,
	Grid2X2,
	House,
	MapPin,
	UserRound,
} from "lucide-react";
import type { ComponentProps } from "react";
import { Brand } from "#/components/layout/brand";
import { AppLink } from "#/components/shared/app-link";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "#/components/ui/sidebar";
export const adminLinks = [
	{ title: "Overzicht", to: "/beheer", icon: House },
	{ title: "Locaties", to: "/beheer/locaties", icon: MapPin },
	{ title: "Velden", to: "/beheer/velden", icon: Grid2X2 },
	{ title: "Planning", to: "/beheer/planning", icon: CalendarDays },
	{ title: "Reserveringen", to: "/beheer/reserveringen", icon: ClipboardList },
	{ title: "Poortdemo", to: "/beheer/poortdemo", icon: DoorOpen },
];
export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
	const pathname = useLocation({ select: (l) => l.pathname });
	const { setOpenMobile } = useSidebar();
	return (
		<Sidebar {...props}>
			<SidebarHeader className="flex h-[72px] justify-center border-b px-5">
				<Brand />
			</SidebarHeader>
			<SidebarContent className="px-2 pt-5">
				<SidebarGroup>
					<SidebarGroupLabel>Beheer</SidebarGroupLabel>
					<SidebarMenu className="mt-2 gap-2">
						{adminLinks.map((link) => (
							<SidebarMenuItem key={link.to}>
								<SidebarMenuButton
									asChild
									isActive={
										pathname === link.to ||
										(link.to !== "/beheer" &&
											pathname.startsWith(`${link.to}/`))
									}
									className="h-12 text-sm"
								>
									<AppLink to={link.to} onClick={() => setOpenMobile(false)}>
										<link.icon className="mr-2 size-5" />
										{link.title}
									</AppLink>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="gap-4 border-t p-5">
				<AppLink to="/" className="flex items-center gap-2 text-sm">
					<ArrowLeft className="size-4" />
					Naar de website
				</AppLink>
				<span className="flex items-center gap-3 text-sm">
					<UserRound className="size-5" />
					Sam · Beheerder
				</span>
			</SidebarFooter>
		</Sidebar>
	);
}
