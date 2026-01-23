import { Router } from "express";
import { getUserCompanies } from "../controllers/user.controller";

const router = Router();

// Get user's tracking companies
router.get("/companies", getUserCompanies);

export default router;
