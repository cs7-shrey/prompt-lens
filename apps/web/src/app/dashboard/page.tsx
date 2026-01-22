"use client";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  // TODO: Move to layout
  if (isPending) {
    return <Loader2 className="animate-spin" />;
  }

  if (!session) {
    return redirect("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}