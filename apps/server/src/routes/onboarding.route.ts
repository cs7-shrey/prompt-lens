import { Router } from "express";
import { createTrackingCompanyAndMonitor, extractDataFromWebsite } from "../controllers/onboarding.controller";
import validationMiddleWare from "../middlewares/validation.middleware";
import { createTrackingCompanyAndMonitorSchema, extractDataFromWebsiteSchema } from "../schema/onboarding.schema";

const router = Router();

// Extract company data from website
router.post(
    "/extract-data",
    validationMiddleWare(extractDataFromWebsiteSchema),
    extractDataFromWebsite
);

// Create tracking company and monitor
router.post(
    "/create",
    validationMiddleWare(createTrackingCompanyAndMonitorSchema),
    createTrackingCompanyAndMonitor
);

export default router;
