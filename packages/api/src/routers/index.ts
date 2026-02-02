import { router } from "..";
import { dashboardRouter } from "./dashboard.route";
import { onboardingRouter } from "./onboarding.route";
import { promptRouter } from "./prompt.route";
import { responseRouter } from "./response.route";
import { userRouter } from "./user.route";

export const appRouter = router({
    user: userRouter,
    onboarding: onboardingRouter,
    dashboard: dashboardRouter,
    prompt: promptRouter,
    response: responseRouter,
})

export type AppRouter = typeof appRouter;