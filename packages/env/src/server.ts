import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.number().min(1).max(65535).default(3000),
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.url(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    ANTHROPIC_API_KEY: z.string().min(1),
    PERPLEXITY_API_KEY: z.string().min(1),
    SCRAPING_DOG_API_KEY: z.string().min(1),
    BASE_FRONTEND_DOMAIN: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
