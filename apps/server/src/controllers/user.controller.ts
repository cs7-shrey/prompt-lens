import type { Request, Response } from "express";
import prisma from "@prompt-lens/db";

export const getUserCompanies = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        const trackingCompanies = await prisma.trackingCompany.findMany({
            where: {
                userId: user.id
            },
            include: {
                competitors: {
                    select: {
                        id: true,
                        name: true,
                        url: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return res.status(200).json({
            companies: trackingCompanies
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
