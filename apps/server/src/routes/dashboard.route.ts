import { getAllAndRelevantMentions, getCitations } from "@/controllers/dashboard.controller";
import validationMiddleWare from "@/middlewares/validation.middleware";
import { getCitationSchema, getMentionSchema } from "@/schema/dashboard.schema";
import { Router } from "express";

export const router = Router();

router.post("/citations", validationMiddleWare(getCitationSchema), getCitations);
router.post("/mentions", validationMiddleWare(getMentionSchema), getAllAndRelevantMentions);