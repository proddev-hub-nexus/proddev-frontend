"use client";
import {
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  Search,
  Settings,
  User2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/general/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/general/components/ui/dropdown-menu";
import Link from "next/link";
import DashboardAccount from "./dashboard-modals/dashboard-account";
import { confirmLogout } from "./confirm-logout";
import { useLogout } from "@/general/hooks/use-logout";
import { useAuthStore } from "@/general/store/auth-store";

const items = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Inbox", url: "/dashboard-inbox", icon: Inbox },
  { title: "Courses", url: "/dashboard-courses", icon: Calendar },
  {
    title: "Enrolled Courses",
    url: "dashboard-enrolled-courses",
    icon: Search,
  },
  { title: "Settings", url: "dashboard-settings", icon: Settings },
];

export default function DashboardSidebar() {
  const { logout } = useLogout();
  const { user } = useAuthStore();

  // Extract the name from user, with fallback
  const name = user?.full_name || "User";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4 font-bold text-2xl">
        <Link href="/dashboard" className="hover:opacity-80">
          Proddev Hub
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <div className="size-6 rounded-full grid place-items-center bg-muted">
                    {name[0]?.toUpperCase()}
                  </div>
                  <span className="truncate max-w-[130px]">{name}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <DashboardAccount />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => confirmLogout(logout)}
                  className="text-destructive focus:text-destructive"
                >
                  <User2 className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
