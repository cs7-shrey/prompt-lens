import { createServer } from "./server";
import { env } from "@prompt-lens/env/server";
import prisma from "@prompt-lens/db";

const app = createServer();

const server = app.listen(env.PORT, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
});

// Graceful shutdown handler
const shutdown = async (signal: string) => {
    console.log(`${signal} received, starting graceful shutdown...`);
    
    server.close(async () => {
        console.log("HTTP server closed");
        
        try {
            await prisma.$disconnect();
            console.log("Database connections closed");
            process.exit(0);
        } catch (error) {
            console.error("Error during shutdown:", error);
            process.exit(1);
        }
    });
    
    // Force shutdown after 10 seconds if graceful shutdown hangs
    setTimeout(() => {
        console.error("Forced shutdown after timeout");
        process.exit(1);
    }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
