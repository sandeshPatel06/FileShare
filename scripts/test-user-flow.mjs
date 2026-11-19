import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.TEST_URL || "https://filesp.pages.dev";
const CHROME_PATH = process.env.CHROME_PATH || "/usr/bin/google-chrome";

console.log(`=======================================================`);
console.log(`Starting Playwright User Simulation against: ${BASE_URL}`);
console.log(`=======================================================\n`);

const results = [];
function record(testName, passed, details = "") {
  results.push({ testName, passed, details });
  const icon = passed ? "✅" : "❌";
  console.log(`${icon} [${passed ? "PASS" : "FAIL"}] ${testName} ${details ? `— ${details}` : ""}`);
}

async function runTests() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!text.includes("google") && !text.includes("doubleclick")) {
        consoleErrors.push(text);
      }
    }
  });

  try {
    // -------------------------------------------------------------
    // 1. HOME PAGE & CORE STYLES
    // -------------------------------------------------------------
    console.log("--- 1. Home Page & Styling Verification ---");
    const homeRes = await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 });
    record("Home page HTTP status is 200", homeRes.status() === 200, `Status: ${homeRes.status()}`);

    const title = await page.title();
    record("Home page title matches SEO specs", title.includes("FileShare"), `"${title}"`);

    const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    record("CSS styles loaded and applied (Theme background active)", bodyBg !== "" && bodyBg !== "rgba(0, 0, 0, 0)", `Computed bg: ${bodyBg}`);

    const openSpaceBtn = page.locator('button:has-text("Open Space")').first();
    record("Hero 'Open Space' launcher CTA visible", await openSpaceBtn.isVisible());

    const newSpaceBtn = page.locator('button:has-text("New Space")').first();
    record("Header 'New Space' button visible", await newSpaceBtn.isVisible());

    // -------------------------------------------------------------
    // 2. THEME SWITCHING (DARK / LIGHT MODE)
    // -------------------------------------------------------------
    console.log("\n--- 2. Theme Switching ---");
    const themeBtn = page.locator('button[aria-label="Toggle theme"]').first();
    if (await themeBtn.isVisible()) {
      const initialHtmlClass = await page.evaluate(() => document.documentElement.className);
      await themeBtn.click();
      await page.waitForTimeout(400);
      const newHtmlClass = await page.evaluate(() => document.documentElement.className);
      record("Theme toggle switches dark/light mode class", initialHtmlClass !== newHtmlClass, `${initialHtmlClass} ➔ ${newHtmlClass}`);
      // Toggle back to preserve dark mode
      await themeBtn.click();
      await page.waitForTimeout(300);
    } else {
      record("Theme toggle button found", false);
    }

    // -------------------------------------------------------------
    // 3. WORKSPACE CREATION & REAL-TIME INTERFACE
    // -------------------------------------------------------------
    console.log("\n--- 3. Workspace Creation & Real-Time Shell ---");
    const testSlug = `pw-audit-${Date.now().toString(36)}`;
    const workspaceUrl = `${BASE_URL}/s/${testSlug}`;
    console.log(`Navigating to unique workspace: ${workspaceUrl}`);

    const wsRes = await page.goto(workspaceUrl, { waitUntil: "networkidle", timeout: 30000 });
    record("Workspace page HTTP status is 200", wsRes.status() === 200);

    const textarea = page.locator("textarea").first();
    await textarea.waitFor({ state: "visible", timeout: 10000 });
    record("Real-time Markdown editor textarea loaded", true);

    const vaultHeading = page.locator('h2:has-text("Vault")').first();
    await vaultHeading.waitFor({ state: "visible", timeout: 10000 });
    record("File Vault panel loaded with heading", true);

    // -------------------------------------------------------------
    // 4. NOTES EDITING & MARKDOWN RENDERING
    // -------------------------------------------------------------
    console.log("\n--- 4. Markdown Notes Editing & Preview ---");
    const testMarkdown = `# Real-Time Collaboration Audit\n\n- Zero registration ephemeral workspace\n- Playwright user verification\n\n> End-to-end verified.`;
    await textarea.fill(testMarkdown);
    await page.waitForTimeout(1500); // Wait for auto-save debounce
    record("Editor textarea accepts content and inputs successfully", true);

    const previewH1 = page.locator("h1:has-text('Real-Time Collaboration Audit')").first();
    record("Markdown preview renders formatted H1 heading", await previewH1.isVisible());

    const previewList = page.locator("li:has-text('Zero registration ephemeral workspace')").first();
    record("Markdown preview renders formatted list items", await previewList.isVisible());

    // -------------------------------------------------------------
    // 5. WORKSPACE MODALS (QR, RENAME, PASSWORD)
    // -------------------------------------------------------------
    console.log("\n--- 5. Workspace Action Modals ---");

    // A. QR Code Modal
    const qrBtn = page.locator('button[title="Show workspace QR code"]').first();
    if (await qrBtn.isVisible()) {
      await qrBtn.click();
      await page.waitForTimeout(500);
      const qrGraphic = page.locator('canvas, svg, img[alt*="QR"]').first();
      record("QR Code modal opens with active graphic", await qrGraphic.isVisible());
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
    }

    // B. Rename Modal
    const renameBtn = page.locator(`button[title^="Edit workspace:"]`).first();
    if (await renameBtn.isVisible()) {
      await renameBtn.click();
      await page.waitForTimeout(500);
      const renameInput = page.locator('input[id="new-slug-input"]').first();
      const inputFound = await renameInput.isVisible();
      record("Rename Workspace modal opens with new slug input", inputFound);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
    }

    // C. Password Lock Modal
    const lockBtn = page.locator('button[title*="password" i]').first();
    if (await lockBtn.isVisible()) {
      await lockBtn.click();
      await page.waitForTimeout(500);
      const passwordInput = page.locator('input[type="password"]').first();
      record("Password protection modal opens with password field", await passwordInput.isVisible());
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
    }

    // -------------------------------------------------------------
    // 6. FILE VAULT UPLOAD & DELETE FLOW
    // -------------------------------------------------------------
    console.log("\n--- 6. File Vault Upload & Deletion ---");
    const tempFileName = `test-vault-${Date.now().toString(36)}.txt`;
    const tempFilePath = path.join("/tmp", tempFileName);
    fs.writeFileSync(tempFilePath, "Playwright automated user verification for 500MB file vault.");

    const fileInput = page.locator('input[type="file"][multiple]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(tempFilePath);
      console.log(`Uploaded file: ${tempFileName}`);

      const fileRow = page.locator(`text="${tempFileName}"`).first();
      await fileRow.waitFor({ state: "visible", timeout: 15000 }).catch(() => null);
      const isUploaded = await fileRow.isVisible();
      record("File uploaded and displayed in vault list", isUploaded, tempFileName);

      if (isUploaded) {
        // Trigger delete button on the file card
        const cardDeleteBtn = page.locator(`button[aria-label="Delete ${tempFileName}"]`).first();
        if (await cardDeleteBtn.isVisible()) {
          await cardDeleteBtn.click();
          await page.waitForTimeout(500);

          // Click "Delete File" confirm button inside ConfirmModal
          const confirmBtn = page.locator('button:has-text("Delete File")').first();
          if (await confirmBtn.isVisible()) {
            await confirmBtn.click();
            await fileRow.waitFor({ state: "hidden", timeout: 8000 }).catch(() => null);
          }
          const fileDeleted = !(await fileRow.isVisible());
          record("File deleted successfully via vault interface", fileDeleted);
        }
      }
    }
    try { fs.unlinkSync(tempFilePath); } catch (e) {}

    // -------------------------------------------------------------
    // 7. SUBPAGES & DOCUMENTATION
    // -------------------------------------------------------------
    console.log("\n--- 7. Documentation & Legal Subpages ---");
    const subpages = [
      { path: "/guide", titleMatch: "User Guide" },
      { path: "/about", titleMatch: "About" },
      { path: "/privacy", titleMatch: "Privacy Policy" },
      { path: "/terms", titleMatch: "Terms" },
      { path: "/contact", titleMatch: "Contact" },
      { path: "/refund", titleMatch: "Refund" },
      { path: "/resources", titleMatch: "Resources" },
    ];

    for (const sub of subpages) {
      const res = await page.goto(`${BASE_URL}${sub.path}`, { waitUntil: "domcontentloaded", timeout: 20000 });
      const h1Text = await page.locator("h1").first().innerText().catch(() => "");
      const matches = h1Text.toLowerCase().includes(sub.titleMatch.toLowerCase());
      record(`Subpage ${sub.path} loads and renders <h1>`, res.status() === 200 && matches, `h1: "${h1Text.trim()}"`);
    }

  } catch (err) {
    console.error("Test execution caught error:", err);
    record("Test run completed without unhandled exceptions", false, err.message);
  } finally {
    await browser.close();
  }

  console.log("\n=======================================================");
  console.log("FINAL PLAYWRIGHT SIMULATION RESULTS");
  console.log("=======================================================");
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`Total Scenarios: ${results.length}`);
  console.log(`Passed:          ${passedCount}`);
  console.log(`Failed:          ${failedCount}`);
  console.log(`Pass Rate:       ${Math.round((passedCount / results.length) * 100)}%`);

  if (consoleErrors.length > 0) {
    console.log(`\nFiltered Browser Console Errors (${consoleErrors.length}):`);
    consoleErrors.slice(0, 5).forEach((e) => console.log(`  • ${e}`));
  }

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Fatal test runner crash:", e);
  process.exit(1);
});
