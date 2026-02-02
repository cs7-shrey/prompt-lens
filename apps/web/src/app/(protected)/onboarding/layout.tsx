import { createServerTRPCClient, trpcClient } from "@/utils/trpc-client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"


export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
    const trpcClient = createServerTRPCClient(await headers())
    const { isCompleted } = await trpcClient.onboarding.isCompleted.query()
    if(isCompleted) {
        redirect("/dashboard")
    }
    return (
        <>
            {children}
        </>
    )
}