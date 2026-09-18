import { z } from "zod";
import { scenarioIds } from "./model";
export const searchSchema = z.object({
	scenario: z
		.string()
		.refine((v) => scenarioIds.includes(v))
		.optional()
		.catch(undefined),
	view: z
		.enum(["loading", "empty", "error", "invalid"])
		.optional()
		.catch(undefined),
	role: z.enum(["guest", "member", "admin"]).optional().catch(undefined),
	sport: z.enum(["Voetbal", "Tennis", "Basketbal"]).optional().catch(undefined),
	location: z.string().optional().catch(undefined),
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.refine((v) => {
			const d = new Date(`${v}T12:00:00Z`);
			return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === v;
		})
		.optional()
		.catch(undefined),
	returnTo: z
		.string()
		.refine((v) => /^\/reserveren\/[a-zA-Z0-9-]+$/.test(v))
		.optional()
		.catch(undefined),
});
export type DemoSearch = z.infer<typeof searchSchema>;
