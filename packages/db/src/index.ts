import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { env } from "@prompt-lens/env/shared";
import { PrismaPg } from "@prisma/adapter-pg";

import ws from "ws";

import { PrismaClient } from "../prisma/generated/client";

const isLocalDb = env.DATABASE_URL.includes("localhost");
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

console.log("isLocalDb —————————————————————————————————————————————————————", isLocalDb);

const adapter = !isLocalDb ? new PrismaNeon({
  connectionString: env.DATABASE_URL,
}) : new PrismaPg({
  connectionString: env.DATABASE_URL,
});

// Singleton pattern to prevent multiple instances in development (HMR)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: adapter });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
export * from '../prisma/generated/client'; 
export * from '../prisma/generated/models'