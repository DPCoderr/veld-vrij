import { defineConfig } from "@playwright/test";
export default defineConfig({
	testDir: "./tests",
	testMatch: "*.spec.ts",
	timeout: 45000,
	expect: { timeout: 10000 },
	fullyParallel: false,
	workers: 1,
	reporter: "list",
	use: {
		baseURL: "http://localhost:3000",
		viewport: { width: 1440, height: 1024 },
		screenshot: "only-on-failure",
		trace: "retain-on-failure",
		launchOptions: { channel: "msedge" },
	},
	webServer: {
		command: "npm run dev",
		url: "http://localhost:3000",
		reuseExistingServer: true,
		timeout: 120000,
	},
});
