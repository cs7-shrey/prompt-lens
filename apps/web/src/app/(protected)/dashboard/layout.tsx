"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
