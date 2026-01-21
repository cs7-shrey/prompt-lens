import type { Browser } from "playwright";
import { humanType, type ScraperService } from "./base";

export class ChatGPTService implements ScraperService {
    browser: Browser;

    constructor(browser: Browser) {
        this.browser = browser;
    }

    async getResponse(prompt: string) {
        const page = await this.browser.newPage();

        await page.goto('https://chatgpt.com');
    
        const pTag = page.locator('p[data-placeholder="Ask anything"]');
        const button = page.locator('button[id="composer-submit-button"]');

        await pTag.waitFor({
            timeout: 5000
        });
    
        await humanType(page, 'p[data-placeholder="Ask anything"]', prompt);
        await button.click({
            timeout: 5000
        });
    
        const goodResponseButton = page.locator('button[aria-label="Good response"]');
        await goodResponseButton.waitFor({
            timeout: 60 * 1000      // Wait up to 60 seconds for response
        });
        console.log("Good Response button found")
    
        // Get messasge
        const messageDiv = page.locator('div[data-message-author-role="assistant"]').first();
        const messageText = await messageDiv.innerText();
        console.log("ChatGPT response:", messageText);
    
    
        // Get sources
        const sourcesButton = page.locator('button[aria-label="Sources"]');
        let citationLinks: string[] = [];
        if (await sourcesButton.count() === 1) {
            console.log("Sources button found");
            await sourcesButton.click();
            const ul = page.locator('li:has-text("Citations") + ul');
            await ul.waitFor({ timeout: 5000 });
    
            const anchorLocator = ul.locator('a')
            await anchorLocator.first().waitFor({
                timeout: 5000
            });
    
            citationLinks = await ul.locator('a').evaluateAll(anchors =>
                anchors.map((a: any) => a.href)
            );
    
            console.log("Citation Links: ", citationLinks);
        }
        return { response: messageText, citations: citationLinks };
    }
}