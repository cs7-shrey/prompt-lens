import { auth } from "@prompt-lens/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    // Kinda accessing db from the nextjs backend
    // Not sure if this should be done
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return redirect("/login");
    }

    return (
        <>
            {children}
        </>
    )
}