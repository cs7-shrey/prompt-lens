import axios from "axios";

import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

async function fetchHTML(url: string): Promise<string> {
    const res = await axios.get(url, {
      timeout: 15000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
  
    return res.data;
}

function extractMainText(html: string, url: string): string {
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
  
    if (!article || !article.textContent) {
      return "";
    }
  
    return article.textContent;
}

function cleanText(text: string): string {
    return text
        .replace(/\s+/g, " ")
        .replace(/©.*$/gi, "")
        .replace(/All rights reserved.*/gi, "")
        .replace(/Cookie Policy.*$/gi, "")
        .trim();
}
export async function scrapeWebsiteContent(url: string): Promise<string> {
  // TODO: make this gather more information rather than just the landing page
    const html = await fetchHTML(url);
    const rawText = extractMainText(html, url);
    return cleanText(rawText);
}