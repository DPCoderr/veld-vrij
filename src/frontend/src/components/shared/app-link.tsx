import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";
import type { DemoSearch } from "#/features/demo/search";
export function AppLink({
	to,
	children,
	className,
	search,
	onClick,
	...props
}: Omit<ComponentProps<"a">, "href" | "children"> & {
	to: string;
	children: ReactNode;
	className?: string;
	search?: Partial<DemoSearch>;
	onClick?: () => void;
}) {
	return (
		<Link
			{...props}
			to={to}
			search={(prev) => ({
				...prev,
				view: undefined,
				returnTo: undefined,
				...search,
			})}
			className={className}
			onClick={onClick}
		>
			{children}
		</Link>
	);
}
