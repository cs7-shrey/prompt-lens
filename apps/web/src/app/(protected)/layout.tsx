"use client";

import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin" />
        </div>;
    }

    if (!session) {
        return redirect("/login");
    }

    return (
        <>
            {children}
        </>
    )
}