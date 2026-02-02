import { router } from "..";
import { dashboardRouter } from "./dashboard.route";
import { onboardingRouter } from "./onboarding.route";
import { userRouter } from "./user.route";

export const appRouter = router({
    user: userRouter,
    onboarding: onboardingRouter,
    dashboard: dashboardRouter,
})

export type AppRouter = typeof appRouter;