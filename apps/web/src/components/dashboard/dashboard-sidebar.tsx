"use client";

import * as React from "react";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Quote,
  Target,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useCompanyStore } from "@/store/company-store";
import BrandLogo from "../brand-logo";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Prompts",
    icon: MessageSquare,
    href: "/dashboard/prompts",
  },
  {
    title: "Responses",
    icon: FileText,
    href: "/dashboard/responses",
  },
  {
    title: "Citations",
    icon: Quote,
    href: "/dashboard/citations",
  },
];

export function DashboardSidebar() {
  const { currentCompany } = useCompanyStore();

  return (
    <Sidebar className="">
      <SidebarHeader className="p-6 space-y-6">
        {/* Product Logo and Name */}
        <div className="flex items-center gap-2.5">
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center shadow-lg"
          >
            <Target size={14} strokeWidth={3} />
          </div>
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-sidebar-foreground">
            PromptLens
          </span>
        </div>

        {/* Current Company */}
        {currentCompany && (
          <div className="flex items-center gap-3 p-3 bg-sidebar-accent border border-sidebar-border rounded-lg hover:bg-white/3 transition-colors">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-md"
            >
              <BrandLogo domain={currentCompany.url} name={currentCompany.name} size={32} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-sidebar-foreground truncate">
                {currentCompany.name}
              </p>
              <p className="text-[10px] text-zinc-600 truncate font-medium tracking-wider">
                {currentCompany.url.replace(/^https?:\/\//, '')}
              </p>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className="group relative px-3 py-2 text-[13px] font-medium text-zinc-400 hover:text-sidebar-foreground rounded-lg transition-all border border-transparent hover:border-sidebar-border"
                  >
                    <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    <span className="tracking-wide">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
