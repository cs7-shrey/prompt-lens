import { Router } from "express";
import { getAllResponsesPaginated, getResponseByPromptIdPaginated } from "../controllers/response.controller";
import validationMiddleWare from "@/middlewares/validation.middleware";
import { getAllResponsesPaginatedSchema, getResponseByPromptIdPaginatedSchema } from "@/schema/response.schema";

const router = Router();

router.post("/all", validationMiddleWare(getAllResponsesPaginatedSchema), getAllResponsesPaginated);
router.post("/prompt", validationMiddleWare(getResponseByPromptIdPaginatedSchema), getResponseByPromptIdPaginated);

export { router };