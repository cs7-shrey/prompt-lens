import { Router } from "express";
import { getAllPromptsWithAnalytics } from "@/controllers/prompt.controller";

export const router = Router();

router.get("/all/:trackingCompanyId", getAllPromptsWithAnalytics);