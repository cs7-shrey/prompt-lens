import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { env as sharedEnv } from "./shared";

/**
 * Server-only environment variables (scraper, API keys, etc.)
 * Extends shared env vars with server-specific ones
 */
export const env = createEnv({
  server: {
    PORT: z.number().min(1).max(65535).default(3000),
    ANTHROPIC_API_KEY: z.string().min(1),
    PERPLEXITY_API_KEY: z.string().min(1),
    SCRAPING_DOG_API_KEY: z.string().min(1),
    DEFAULT_CHROME_PROFILE_PATH: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  extends: [sharedEnv],
});
