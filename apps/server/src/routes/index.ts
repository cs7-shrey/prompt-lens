import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import onboardingRoutes from "./onboarding.route";
import userRoutes from "./user.route";
import { router as dashboardRouter } from "./dashboard.route";
import { router as promptRouter } from "./prompt.route";
import { router as responseRouter } from "./response.route";

const router = Router();

// Auth
router.use(authMiddleware);

router.use("/onboarding", onboardingRoutes);
router.use("/user", userRoutes);
router.use("/dashboard", dashboardRouter)
router.use("/prompts", promptRouter);
router.use("/responses", responseRouter);

export default router;
