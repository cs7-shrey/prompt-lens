// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fs from 'node:fs';
import { type Page, type BrowserContext } from 'playwright';
// import playwright from 'playwright'; // Core Playwright
import path from 'node:path';
import playwrightExtra from 'playwright-extra'; // For stealth
// import StealthPlugin from 'puppeteer-extra-plugin-stealth'; // Stealth plugin (works with Playwright via playwright-extra)
import { env } from '@prompt-lens/env/server';

export interface ScraperService {
  browser: BrowserContext
  getResponse(prompt: string): Promise<{ response?: string, citations: string[] }>;
}

export async function humanType(page: Page, selector: string, text: string) {
  const input = page.locator(selector);
  if (
    await input.innerText({
      timeout: 5000,
    }) !== ''
  ) {
    await input.fill('');
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  }
  await input.click();
  for (const char of text) {
    await page.keyboard.type(char, { delay: 50 + Math.random() * 100 });
  }
}

function getChromeExecutablePath() {
  if (process.platform === 'win32') {
    return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'; // Common Windows path
    // Or: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  } else if (process.platform === 'darwin') {
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  } else if (process.platform === 'linux') {
    return '/usr/bin/google-chrome'; // Or check with `which google-chrome`
  }
  throw new Error('Unsupported OS');
}

export async function launchRealChromeWithProfile({ profileDir = env.DEFAULT_CHROME_PROFILE_PATH, proxy = null, headless = false } = {}) {
  const executablePath = getChromeExecutablePath();

  if (!fs.existsSync(executablePath)) {
    throw new Error(`Chrome not found at ${executablePath} – install Chrome or fix path`);
  }

  const profilePath = path.resolve(profileDir);
  if (!fs.existsSync(profilePath)) {
    throw new Error(`Profile directory not found: ${profilePath}`);
  }

  const launchArgs = [
    // `--user-data-dir=${profilePath}`,
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-blink-features=AutomationControlled',
    '--disable-web-security', // Optional
    '--disable-features=IsolateOrigins,site-per-process',
    '--start-maximized',
    // Add more if needed: '--disable-extensions' to reduce noise, or keep for realism
  ];

  if (proxy) {
    launchArgs.push(`--proxy-server=${proxy}`); // e.g., 'http://user:pass@ip:port'
  }

  const browser = await playwrightExtra.chromium.launchPersistentContext(profileDir, {
    executablePath,
    headless,
    args: launchArgs,
  });
  //   playwrightExtra.chromium.

  // Create context (profile already handles storage/cookies)
  //   const context = await browser.newContext({
  //     // Your randomized viewport, UA, etc. (stealth helps here)
  //     userAgent: randomUseragent.getRandom(),
  //     viewport: { width: 1920, height: 1080 }, // Or randomize
  //     // Add locale, geolocation, etc. as before
  //   });

  //   // Apply your init scripts, headers, etc.
  //   await context.addInitScript(() => { /* your spoofing code */ });

  const page = await browser.newPage();

  return { browser, page };
}