import type { Browser, Page } from "playwright";
import { humanType, type ScraperService } from "./base";

export class PerplexityService implements ScraperService {
    browser: Browser;
    page: Page;

    constructor(browser: Browser, page: Page) {
        this.browser = browser;
        this.page = page;
    }

    async getResponse(prompt: string) {
        const page = await this.browser.newPage();

        await page.goto('https://perplexity.ai/');

        const input = page.locator('div[id="ask-input"]')
        await input.waitFor({
            timeout: 10000
        })

        // Type prompt
        await humanType(page, 'div[id="ask-input"]', prompt);
        const button = page.locator('button[aria-label="Submit"]');
        await button.click({
            timeout: 5000,
        });
    
        // Wait for the generation to complete
        const rewriteButtonQuery = 'button[aria-label="Rewrite"]';
        const rewriteButton = page.locator(rewriteButtonQuery);
        await rewriteButton.waitFor({
            timeout: 120 * 1000      // Wait up to 60 seconds for response
        })
        console.log("Rewrite button found")
    
        // Get response
        const contentDiv = page.locator('div[id="markdown-content-0"]');
        const contentText = await contentDiv.innerText();
        console.log("Perplexity response:", contentText);
    
    
        // Get citations

        const sourcesButton = page.locator(rewriteButtonQuery + ' + div');
        let citations: string[] = [];
        if (await sourcesButton.count() === 1) {
            await sourcesButton.click();
    
            const citationDiv = page.locator('div[id$="-content-citations"]');
            await citationDiv.waitFor({
                timeout: 15000
            });
    
            const citationLinks = await citationDiv.locator('a').evaluateAll(anchors =>
                anchors.map((a: any) => a.href)
            );
    
            citations = citationLinks;
            console.log("Citation Links: ", citationLinks);
        }

        return { response: contentText, citations: citations };
    }
}