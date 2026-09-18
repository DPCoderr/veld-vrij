import { useLocation, useSearch } from "@tanstack/react-router";
import type { Dispatch, ReactNode } from "react";
import { createContext, useContext, useReducer } from "react";
import { demoReducer, initialState } from "./model";
import type { DemoAction, DemoState } from "./types";

const DemoContext = createContext<{
	state: DemoState;
	dispatch: Dispatch<DemoAction>;
} | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
	const search = useSearch({ from: "__root__" });
	const path = useLocation({ select: (l) => l.pathname });
	const scenario =
		search.scenario ??
		(path.startsWith("/beheer/poortdemo")
			? "gate-allowed"
			: path.startsWith("/beheer")
				? "admin"
				: path.startsWith("/reserveringen") || path === "/mijn-reserveringen"
					? "confirmed"
					: "browse");
	const [state, dispatch] = useReducer(demoReducer, undefined, () =>
		initialState(scenario, search.role),
	);
	return (
		<DemoContext.Provider value={{ state, dispatch }}>
			{children}
		</DemoContext.Provider>
	);
}
export function useDemo() {
	const context = useContext(DemoContext);
	if (!context) throw new Error("DemoProvider ontbreekt");
	return context;
}
