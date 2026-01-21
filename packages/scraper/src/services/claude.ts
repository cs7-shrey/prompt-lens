import type { BrowserContext, Locator } from "playwright";
import { humanType, type ScraperService } from "./base";

export class ClaudeService implements ScraperService {
    browser: BrowserContext;

    constructor(browser: BrowserContext) {
        this.browser = browser;
    }

    async getResponse(prompt: string) {
        const page = await this.browser.newPage();
        await page.goto('https://claude.ai/');

        const inputDiv = page.locator('div[aria-label="Write your prompt to Claude"]');
        await inputDiv.waitFor({
            timeout: 5000
        });
        await humanType(page, 'div[aria-label="Write your prompt to Claude"]', prompt);
    
        const submitButton = page.locator('button[aria-label="Send message"]');
        await submitButton.click();
    
        const thumbsUpButton = page.locator('button[aria-label="Give positive feedback"]');
        await thumbsUpButton.waitFor({
            timeout: 60 * 1000      // Wait up to 60 seconds for response
        });
        console.log("Thumbs up button found")
    
        const messageDiv = page.locator('div[class*="font-claude-response"]').first();
        const messageText = await this.getDivInnerTextWithoutButtonsAndLinks(messageDiv);
    
        console.log("Claude response:", messageText);
    
        const citations = await this.getClaudeCitations(messageDiv);
        console.log("Claude citations:", citations);

        return { response: messageText, citations: citations };
    }

    async getDivInnerTextWithoutButtonsAndLinks(div: Locator) {
        const text = await div.evaluate((el: HTMLDivElement) => {
            const clone = el.cloneNode(true) as HTMLElement;
    
            // remove unwanted elements
            (clone).querySelectorAll('a, button').forEach(n => n.remove());
    
            return clone.innerText.trim();
        });
        return text;
    }
    
    async getClaudeCitations(div: Locator) {
        return await div.evaluate((el: HTMLElement) => {
            const clone = el.cloneNode(true) as HTMLElement;
    
            // remove unwanted elements
            clone.querySelectorAll('button').forEach(n => n.remove());
    
            const linkElements = clone.querySelectorAll('a');
            return Array.from(linkElements).map(a => a.href).filter(href => href && href.startsWith('http') );
        });
    }
}