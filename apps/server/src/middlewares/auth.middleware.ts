import { auth } from "@prompt-lens/auth";
import type { NextFunction, Request, Response } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Convert Express headers to Web API Headers format
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        const headerValue = Array.isArray(value) ? value[0] : value;
        if (headerValue) {
          headers.set(key, headerValue);
        }
      }
    });

    const session = await auth.api.getSession({
      headers,
    });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = session.user;
    req.session = session.session;

    next();
  } catch (error) {
    console.error("Auth server error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
