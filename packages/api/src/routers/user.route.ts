import prisma from "@prompt-lens/db";
import { protectedProcedure, router } from ".."

export const userRouter = router({
    getTrackingCompanies: protectedProcedure.query(async ({ ctx }) => {
        const { user } = ctx;
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
        return {
            companies: trackingCompanies,
        };
    })
})