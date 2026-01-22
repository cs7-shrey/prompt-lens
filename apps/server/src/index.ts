import { auth } from "@prompt-lens/auth";
import { env } from "@prompt-lens/env/server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { authMiddleware } from "./middlewares/auth.middleware";
import routes from "./routes";

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

// Protected route example - requires authentication
app.get("/api/me", authMiddleware, (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

// Another protected route example
app.get("/api/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    message: `Hello, ${req.user?.name || req.user?.email}!`,
    userId: req.user?.id,
    email: req.user?.email,
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
