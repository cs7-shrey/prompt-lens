"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Quote,
  Target,
  User2,
  ChevronUp,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCompanyStore } from "@/store/company-store";
import { authClient } from "@/lib/auth-client";
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
];

export function DashboardSidebar() {
  const { currentCompany } = useCompanyStore();
  const { data: session } = authClient.useSession();
  console.log(currentCompany);
  
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  return (
    <Sidebar className="">
      <SidebarHeader className="py-2 px-0 gap-0">
        {/* Product Logo and Name */}
        <div className="p-2 flex items-center gap-2.5 w-full">
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
          <div 
            className="m-2 flex items-center gap-3 p-3 bg-white/5 border border-sidebar-border rounded-lg hover:bg-white/6 transition-colors"
            // onClick={}
            >
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
                {currentCompany.url.replace(/^https?:\/\//, '').replace(/\/+$/, "")}
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
                  <Link href={item.href as any}  className="w-full">
                    <SidebarMenuButton
                      className="group relative px-3 py-2 text-[13px] font-medium text-zinc-400 hover:text-sidebar-foreground rounded-lg transition-all border border-transparent hover:border-sidebar-border"
                    >
                      <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                      <span className="tracking-wide">{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User footer */}
      <SidebarFooter className="bg-[#0A0A0A] border-t border-t-[#222222]">
        <SidebarMenu>
          <SidebarMenuItem className="">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <SidebarMenuButton>
                  <User2 /> {session?.user?.name || "User"}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] rounded-sm"
              >
                <DropdownMenuItem onClick={handleSignOut} className={""}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
