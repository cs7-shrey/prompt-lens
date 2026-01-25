"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { useCompany } from "@/hooks/use-company";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentCompany, isLoading } = useCompany();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!currentCompany) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-400">
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset className="bg-[#13131355]">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
