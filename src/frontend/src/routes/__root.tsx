import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
	useLocation,
} from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import { AdminLayout } from "#/components/layout/admin-layout";
import { PublicLayout } from "#/components/layout/public-layout";
import { AppLink } from "#/components/shared/app-link";
import { Toaster } from "#/components/ui/sonner";
import { DemoProvider } from "#/features/demo/demo-provider";
import { searchSchema } from "#/features/demo/search";
import appCss from "../styles.css?url";
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
	{
		validateSearch: (search) => searchSchema.parse(search),
		head: () => ({
			meta: [
				{ charSet: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ title: "VeldVrij · Jouw sportplek. Jouw moment." },
				{
					name: "description",
					content:
						"Reserveer een heel sportveld voor jouw groep. Voetbal, tennis en basketbal op VeldVrij.",
				},
			],
			links: [
				{ rel: "stylesheet", href: appCss },
				{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
			],
		}),
		component: RootApp,
		shellComponent: RootDocument,
		notFoundComponent: () => (
			<div className="page-wrap py-20">
				<h1 className="text-3xl font-bold">Deze pagina bestaat niet</h1>
				<AppLink to="/" className="mt-6 inline-block text-primary underline">
					Terug naar de homepage
				</AppLink>
			</div>
		),
	},
);
function RootApp() {
	useEffect(() => {
		document.documentElement.dataset.hydrated = "true";
	}, []);
	const search = Route.useSearch();
	const admin = useLocation({
		select: (l) => l.pathname.startsWith("/beheer"),
	});
	const Layout = admin ? AdminLayout : PublicLayout;
	return (
		<DemoProvider
			key={`${search.scenario ?? "default"}-${search.role ?? "default"}`}
		>
			<Layout>
				<Outlet />
			</Layout>
			<Toaster richColors position="bottom-right" />
		</DemoProvider>
	);
}
function RootDocument({ children }: { children: ReactNode }) {
	return (
		<html lang="nl">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
