import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { env } from "@prompt-lens/env/server";
import ws from "ws";

import { PrismaClient } from "../prisma/generated/client";

neonConfig.webSocketConstructor = ws;
// Removed poolQueryViaFetch as we're using WebSockets in Node.js

const adapter = new PrismaNeon({
  connectionString: env.DATABASE_URL,
});

// Singleton pattern to prevent multiple instances in development (HMR)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
export * from '../prisma/generated/client'; 
export * from '../prisma/generated/models'