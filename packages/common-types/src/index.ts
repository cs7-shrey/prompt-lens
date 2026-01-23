import type { Mention, Brand, Prompt, Response } from "@prompt-lens/db";

// Re-define Sentiment enum to avoid importing Prisma client in browser
export enum Sentiment {
  positive = "positive",
  negative = "negative",
  neutral = "neutral",
}

export type { Mention, Brand, Prompt, Response };