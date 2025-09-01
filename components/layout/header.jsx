"use client";

import { useNotifications } from "@/hooks/use-database";
import { useAuth } from "@/providers/auth-provider";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Breadcrumb } from "../ui/breadcrumb";
import SearchInput from "../ui/search-input";
import { UserNav } from "./user-nav";
import { ModeToggle } from "./ThemeToggle/theme-toggle";
import { ThemeSelector } from "../ui/theme-selector";

export function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { data: notifications } = useNotifications(user?.$id || "");

  const unreadCount = notifications?.filter((n) => !n.read_status).length || 0;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-2 px-4">
        {/* <CtaGithub /> */}
        <div className="hidden md:flex">
          <SearchInput />
        </div>
        <UserNav />
        <ModeToggle />
        <ThemeSelector />
      </div>
    </header>
  );
}
