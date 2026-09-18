import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

// Run after the visual tests. Each board compares two selected mockups with
// the corresponding browser screenshots, without altering either image.
const frontend = resolve(import.meta.dirname, "..");
const references = resolve(frontend, "../../docs/mockups/2026-09-17");
const { files } = JSON.parse(await readFile(resolve(references, "manifest.json"), "utf8"));
const output = resolve(frontend, "test-results/review");
await mkdir(output, { recursive: true });
const boards = [];
for (let i = 0; i < files.length; i += 2) {
  boards.push(`<section>${files.slice(i, i + 2).map((entry) => {
    const actual = resolve(frontend, `test-results/visual-mockup-${entry.id}/${entry.id}.png`);
    return `<article><h2>${entry.id}</h2><div><figure><figcaption>Mockup</figcaption><img src="${pathToFileURL(resolve(references, entry.filename))}" /></figure><figure><figcaption>React-frontend</figcaption><img src="${pathToFileURL(actual)}" /></figure></div></article>`;
  }).join("")}</section>`);
}
const html = resolve(output, "index.html");
await writeFile(html, `<!doctype html><html lang="nl"><meta charset="utf-8"><title>VeldVrij mockupvergelijking</title><style>body{margin:0;background:#e7ebe5;font:16px system-ui}section{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:24px;align-items:start}article{min-width:0}h2{font-size:18px;margin:0 0 12px}article>div{display:grid;grid-template-columns:1fr 1fr;gap:12px}figure{margin:0}figcaption{padding:8px;background:white}img{display:block;width:100%;height:auto}</style>${boards.join("")}</html>`);
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1900, height: 1100 } });
  await page.goto(pathToFileURL(html).href);
  await page.evaluate(async () => Promise.all(Array.from(document.images, img => img.decode())));
  const sections = page.locator("section");
  for (let i = 0; i < await sections.count(); i++) {
    await sections.nth(i).screenshot({ path: resolve(output, `board-${String(i + 1).padStart(2, "0")}.png`) });
  }
  console.log(`Created ${boards.length} review boards for ${files.length} mockups in ${output}`);
} finally {
  await browser.close();
}
