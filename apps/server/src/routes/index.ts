import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import onboardingRoutes from "./onboarding.route";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.use("/onboarding", onboardingRoutes);

export default router;
