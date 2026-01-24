import { auth } from "@prompt-lens/auth";
import { env } from "@prompt-lens/env/server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { authMiddleware } from "./middlewares/auth.middleware";
import routes from "./routes";
import { startJobExecutor } from "@prompt-lens/scraper";
import { startAnalyticsRunner } from "@prompt-lens/analytics";
import { startBrandEnricher } from "@prompt-lens/brands";

export function createServer() {
    const app = express();
    app.use(
        cors({
            origin: env.CORS_ORIGIN,
            methods: ["GET", "POST", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        }),
    );

    app.all("/api/auth{/*path}", toNodeHandler(auth));
    app.use(express.json());

    // Routes
    app.use("/api", routes);
    app.get("/", (_req, res) => {
        res.status(200).send("OK");
    })
    app.get("/api/me", authMiddleware, (req, res) => {
        res.status(200).json({
            user: req.user,
        });
    });
    app.get("/api/health", (_req, res) => {
        res.status(200).json({
            status: "ok",
        });
    });

    startJobExecutor(2);
    startAnalyticsRunner(3);
    startBrandEnricher(10);

    console.log("Background services started");

    return app;
}