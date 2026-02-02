import { router } from "..";
import { onboardingRouter } from "./onboarding.route";
import { userRouter } from "./user.route";

export const appRouter = router({
    user: userRouter,
    onboarding: onboardingRouter,
})

export type AppRouter = typeof appRouter;