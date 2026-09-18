import { expect, type Page, test } from "@playwright/test";

async function open(page: Page, url: string) {
	await page.goto(url);
	await page.locator("html[data-hydrated=true]").waitFor();
}
test("zoeken, Google-login, betaald boeken en annuleren", async ({ page }) => {
	await open(page, "/?scenario=browse");
	await page.getByRole("button", { name: "Bekijk sportplekken" }).click();
	await expect(
		page.getByRole("heading", { name: "Vind jouw sportplek" }),
	).toBeVisible();
	await page
		.getByRole("article")
		.filter({ has: page.getByRole("heading", { name: "Multiveld Buiten" }) })
		.getByRole("link", { name: "Bekijk tijden" })
		.click();
	await page
		.getByRole("button", { name: "Verder", exact: true })
		.filter({ visible: true })
		.click();
	await expect(
		page.getByRole("heading", { name: "Welkom terug" }),
	).toBeVisible();
	await page.getByRole("button", { name: "Inloggen met Google" }).click();
	await expect(
		page.getByRole("heading", { name: "Controleer je reservering" }),
	).toBeVisible();
	await page.getByRole("button", { name: "Verder naar betalen" }).click();
	await page.getByRole("button", { name: "Betaling geslaagd" }).click();
	await expect(page.getByText("4837 1902")).toBeVisible();
	await page
		.getByRole("button", { name: "Reservering annuleren", exact: true })
		.click();
	await expect(page.getByText(/Je ontvangt.*12,00 terug/)).toBeVisible();
	await page.getByRole("button", { name: "Ja, annuleren" }).click();
	await expect(
		page.getByRole("heading", { name: "Je reservering is geannuleerd" }),
	).toBeVisible();
	await expect(page.getByText("4837 1902")).toHaveCount(0);
});
test("gratis boeken slaat betaling over", async ({ page }) => {
	await open(
		page,
		"/sportplekken/multiveld-buiten?scenario=browse&role=member",
	);
	await page.getByRole("radio").first().check();
	await page
		.getByRole("button", { name: "Verder", exact: true })
		.filter({ visible: true })
		.click();
	await page.getByRole("button", { name: "Gratis reserveren" }).click();
	await expect(
		page.getByRole("heading", { name: "Je reservering is bevestigd" }),
	).toBeVisible();
	await expect(page.getByText("Je hoeft niet te betalen.")).toBeVisible();
	await expect(page.getByRole("dialog")).toHaveCount(0);
	await page.getByRole("link", { name: "Bekijk je toegangscode" }).click();
	await expect(
		page.getByRole("heading", { name: "Jouw toegangscode" }),
	).toBeVisible();
});
test("betaling controleren heeft geen actieve code of nieuwe betaalknop", async ({
	page,
}) => {
	await open(page, "/reserveringen/res-buiten-14?scenario=payment-checking");
	await expect(
		page.getByRole("heading", { name: "We controleren je betaling" }),
	).toBeVisible();
	await expect(page.getByRole("button", { name: /betalen/i })).toHaveCount(0);
	await expect(
		page.getByRole("heading", { name: "Jouw toegangscode" }),
	).toHaveCount(0);
});
test("veld opslaan en geboekt slot sluiten blijven tijdens navigatie behouden", async ({
	page,
}) => {
	await open(page, "/beheer/velden/multiveld-buiten?scenario=admin");
	await page.getByLabel("Veldnaam").fill("Multiveld Test");
	await page.getByRole("button", { name: "Opslaan", exact: true }).click();
	await expect(
		page.getByText("Multiveld Test", { exact: true }).filter({ visible: true }),
	).toBeVisible();
	await page.getByRole("link", { name: "Planning", exact: true }).click();
	await page
		.getByRole("button", { name: "Sluiten 14:00–15:00", exact: true })
		.click();
	await page.getByLabel("Reden").fill("Onderhoud aan de omheining");
	await page.getByRole("button", { name: "Sluiten en annuleren" }).click();
	await page.getByRole("link", { name: "Poortdemo", exact: true }).click();
	await page.getByLabel("Achtcijferige toegangscode").fill("48371902");
	await page.getByRole("button", { name: "Controleer toegang" }).click();
	await expect(
		page.getByRole("heading", { name: "Toegang geweigerd" }),
	).toBeVisible();
	await page.reload();
	await page.locator("html[data-hydrated=true]").waitFor();
	await page.getByRole("link", { name: "Velden", exact: true }).click();
	await expect(
		page
			.getByText("Multiveld Buiten", { exact: true })
			.filter({ visible: true }),
	).toBeVisible();
});
test("poortdemo toont toegestaan en weigert hetzelfde nummer op ander veld", async ({
	page,
}) => {
	await open(page, "/beheer/poortdemo?scenario=gate-allowed");
	await expect(
		page.getByRole("heading", { name: "Toegang toegestaan" }),
	).toBeVisible();
	await page.getByRole("combobox").click();
	await page.getByRole("option", { name: "Tennisbaan Parkzicht" }).click();
	await page.getByRole("button", { name: "Controleer toegang" }).click();
	await expect(
		page.getByRole("heading", { name: "Toegang geweigerd" }),
	).toBeVisible();
	await expect(page.getByRole("list").last()).not.toContainText("48371902");
});
test("formuliervalidatie, mobiel menu en deelbare foutstate", async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await open(page, "/inloggen");
	await page.getByLabel("E-mailadres").fill("sam@");
	await page.getByRole("button", { name: "Inloggen", exact: true }).click();
	await expect(page.getByText("Vul een geldig e-mailadres in.")).toBeVisible();
	await page.getByRole("button", { name: "Menu", exact: true }).click();
	await page
		.getByRole("dialog")
		.getByRole("link", { name: "Sportplekken", exact: true })
		.click();
	await expect(
		page.getByRole("heading", { name: "Vind jouw sportplek" }),
	).toBeVisible();
	await open(page, "/sportplekken?view=error");
	await page.getByRole("button", { name: "Opnieuw proberen" }).click();
	await expect(page.getByRole("article")).toHaveCount(3);
});

test("mislukte betaling kan opnieuw worden geprobeerd en gecontroleerd", async ({
	page,
}) => {
	await open(page, "/reserveren/buiten-14?scenario=browse&role=member");
	await page.getByRole("button", { name: "Verder naar betalen" }).click();
	await page
		.getByRole("button", { name: "Betaling mislukt", exact: true })
		.click();
	await expect(
		page.getByRole("heading", { name: "De betaling is niet gelukt" }),
	).toBeVisible();
	await expect(page.getByText("4837 1902")).toHaveCount(0);
	await page.getByRole("button", { name: "Opnieuw betalen" }).click();
	await page
		.getByRole("button", { name: "Betaling wordt gecontroleerd" })
		.click();
	await expect(
		page.getByRole("heading", { name: "We controleren je betaling" }),
	).toBeVisible();
});

test("registreren vervolgt de onderbroken boeking", async ({ page }) => {
	await open(
		page,
		"/inloggen?scenario=browse&returnTo=%2Freserveren%2Fbuiten-14",
	);
	await page.getByRole("link", { name: "Registreren", exact: true }).click();
	await page.getByLabel("Naam", { exact: true }).fill("Sam Demo");
	await page.getByLabel("E-mailadres").fill("sam@example.com");
	await page.getByLabel("Wachtwoord", { exact: true }).fill("demo-wachtwoord");
	await page.getByRole("button", { name: "Account maken" }).click();
	await expect(
		page.getByRole("heading", { name: "Controleer je reservering" }),
	).toBeVisible();
});

test("locaties en nieuwe velden delen wijzigingen en dialogs werken met toetsenbord", async ({
	page,
}) => {
	await open(page, "/beheer/locaties?scenario=admin");
	const add = page.getByRole("button", { name: "Locatie toevoegen" });
	await add.focus();
	await page.keyboard.press("Enter");
	const dialog = page.getByRole("dialog");
	await expect(dialog.getByLabel("Naam", { exact: true })).toBeFocused();
	await dialog.getByLabel("Naam", { exact: true }).fill("Sportpark Zuid");
	await dialog
		.getByLabel("Adres", { exact: true })
		.fill("Sportlaan 10, Utrecht");
	await dialog.getByRole("button", { name: "Opslaan" }).click();
	await expect(
		page.getByText("Sportpark Zuid", { exact: true }).filter({ visible: true }),
	).toBeVisible();
	await add.click();
	await page.keyboard.press("Escape");
	await expect(dialog).toHaveCount(0);
	await expect(add).toBeFocused();
	await page.getByRole("link", { name: "Velden", exact: true }).click();
	await page.getByRole("link", { name: "Veld toevoegen" }).click();
	await page.getByLabel("Veldnaam").fill("Veld Zuid");
	await page.getByRole("combobox").first().click();
	await page.getByRole("option", { name: "Sportpark Zuid" }).click();
	await page.getByRole("button", { name: "Opslaan", exact: true }).click();
	await expect(
		page.getByText("Veld Zuid", { exact: true }).filter({ visible: true }),
	).toBeVisible();
	await expect(
		page.getByText("Sportpark Zuid", { exact: true }).filter({ visible: true }),
	).toBeVisible();
});

test("datumkiezer ondersteunt toetsenbord en ongeldige URL-datums vallen terug", async ({
	page,
}) => {
	await open(page, "/sportplekken?scenario=browse&date=2026-99-99");
	const trigger = page.getByRole("button", { name: "Datum kiezen" });
	await expect(trigger).toContainText("19 september");
	await trigger.focus();
	await page.keyboard.press("Enter");
	await expect(page.getByRole("dialog")).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(trigger).toBeFocused();
	await trigger.click();
	await page.getByRole("button", { name: /20 september 2026/ }).click();
	await expect(trigger).toContainText("20 september");
	await expect(page).toHaveURL(/date=2026-09-20/);
});
