import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

interface Mockup {
	id: string;
	format: string;
	filename: string;
}
const manifest = JSON.parse(
	readFileSync(
		new URL("../../../docs/mockups/2026-09-17/manifest.json", import.meta.url),
		"utf8",
	),
);
const entries: Mockup[] = manifest.files;
const routes: Record<string, string> = {
	"01": "/?scenario=browse",
	"02": "/sportplekken?scenario=browse",
	"03": "/sportplekken/multiveld-buiten?scenario=browse",
	"04": "/inloggen?scenario=browse&view=invalid",
	"05": "/registreren?scenario=browse",
	"06": "/reserveren/buiten-14?scenario=browse&role=member",
	"07": "/mijn-reserveringen?scenario=confirmed",
	"08": "/reserveringen/res-buiten-14?scenario=confirmed",
	"09": "/zo-werkt-het?scenario=browse",
	"10": "/beheer?scenario=admin",
	"11": "/beheer/velden/multiveld-buiten?scenario=admin",
	"12": "/beheer/planning?scenario=admin",
	"13": "/beheer/poortdemo?scenario=gate-allowed",
	"14": "/beheer/velden?scenario=admin",
	"15": "/beheer/locaties?scenario=admin",
	"16": "/beheer/reserveringen?scenario=admin",
	"17": "/reserveringen/res-buiten-14?scenario=payment-checking",
	"18": "/reserveringen/res-buiten-14?scenario=cancel",
	"19": "/beheer/planning?scenario=close-slot",
	"20": "/beheer/poortdemo?scenario=gate-denied",
	"21": "/reserveringen/res-buiten-12/bevestiging?scenario=free-confirmed",
};
for (const entry of entries)
	test(`mockup ${entry.id}`, async ({ page }, testInfo) => {
		const errors: string[] = [];
		page.on("pageerror", (e) => errors.push(e.message));
		page.on("console", (m) => {
			if (m.type() === "error" && !m.text().includes("favicon"))
				errors.push(m.text());
		});
		await page.setViewportSize(
			entry.format === "mobile"
				? { width: 390, height: 844 }
				: entry.format === "tablet"
					? { width: 1024, height: 768 }
					: { width: 1440, height: 1024 },
		);
		await page.goto(routes[entry.id.slice(0, 2)]);
		await page.locator("html[data-hydrated=true]").waitFor();
		await expect(page.locator("h1")).toBeVisible();
		await page.evaluate(() => document.fonts.ready);
		await expect
			.poll(() =>
				page.evaluate(() =>
					Array.from(document.images)
						.filter((img) => {
							const r = img.getBoundingClientRect();
							return r.width > 0 && r.top < window.innerHeight && r.bottom > 0;
						})
						.every((img) => img.complete && img.naturalWidth > 0),
				),
			)
			.toBe(true);
		if (["18", "19"].includes(entry.id.slice(0, 2)))
			await expect(
				page.getByRole("dialog").or(page.getByRole("alertdialog")),
			).toBeVisible();
		expect(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= window.innerWidth,
			),
		).toBe(true);
		expect(errors).toEqual([]);
		await page.screenshot({
			path: testInfo.outputPath(`${entry.id}.png`),
			animations: "disabled",
			fullPage: false,
		});
	});
