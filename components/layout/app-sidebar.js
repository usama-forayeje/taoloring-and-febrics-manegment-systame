"use client"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "../ui/sidebar"
import { UserAvatarProfile } from "@/components/ui/user-avatar-profile"
import { Badge } from "@/components/ui/badge"
import { navItems } from "../../constants/data"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  IconBell,
  IconChevronRight,
  IconChevronsDown,
  IconCreditCard,
  IconLogout,
  IconPhotoUp,
  IconUserCircle,
  IconHome,
  IconDashboard,
  IconUsers,
} from "@tabler/icons-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { OrgSwitcher } from "@/components/ui/org-switcher"
import { useAuthStore } from "@/store/auth-store"
import { useAuth } from "@/providers/auth-provider"


const icons = {
  IconBell,
  IconChevronRight,
  IconChevronsDown,
  IconCreditCard,
  IconLogout,
  IconPhotoUp,
  IconUserCircle,
  IconHome,
  IconDashboard,
  IconUsers,
}

export const company = {
  name: "Tailoring & Fabrics",
  logo: IconPhotoUp,
  plan: "Professional",
}

const tenants = [
  { id: "1", name: "Main Shop" },
  { id: "2", name: "Branch Store" },
  { id: "3", name: "Online Store" },
]

export default function AppSidebar() {
  const pathname = usePathname()
  const { isOpen } = useMediaQuery()
  const router = useRouter()

  // Use Auth Context instead of store
  const {
    userProfile,
    loading,
    isAuthenticated,
    logout,
    user,
    hasRole,
    hasAnyRole
  } = useAuth()




  const handleSwitchTenant = (tenantId) => {
    console.log("Switching to tenant:", tenantId)
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/sign-in')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const activeTenant = tenants[0]

  // Filter navigation items based on user role
  const filteredNavItems = useMemo(() => {
    if (!userProfile) return []

    const userRole = userProfile.role

    return navItems.filter((item) => {
      // Role-based filtering logic
      if (item.roles && !item.roles.includes(userRole)) {
        return false
      }

      // Filter sub-items based on permissions
      if (item.items && item.items.length > 0) {
        item.filteredItems = item.items.filter((subItem) => {
          if (subItem.roles && !subItem.roles.includes(userRole)) {
            return false
          }
          return true
        })

        // If no sub-items are accessible, hide the main item
        if (item.filteredItems.length === 0 && item.items.length > 0) {
          return false
        }
      }

      return true
    })
  }, [userProfile])


  if (loading || !isAuthenticated) {
    return (
      <Sidebar collapsible="icon">
        <SidebarContent className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </SidebarContent>
      </Sidebar>
    )
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <OrgSwitcher tenants={tenants} defaultTenant={activeTenant} onTenantSwitch={handleSwitchTenant} />
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarMenu>
            {filteredNavItems.map((item) => {
              // এখানে একটি অতিরিক্ত চেক যুক্ত করা হয়েছে যাতে যদি আইকন না থাকে তাহলে error না হয়
              const IconComponent = item.icon && icons[item.icon] ? icons[item.icon] : IconHome

              return (item?.filteredItems || item?.items)?.length > 0 ? (
                <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} isActive={pathname === item.url}>
                        <IconComponent />
                        <span>{item.title}</span>
                        <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {(item.filteredItems || item.items)?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <IconComponent />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex items-center gap-2 flex-1 text-left text-sm leading-tight">
                    {user && <UserAvatarProfile className="h-8 w-8 rounded-lg" user={user} />}
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name || "User"}</span>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="secondary"
                          className={`text-xs px-1 py-0 `}
                        >
                          {/* {getRoleDisplayName(user?.role || user?.prefs?.role)} */}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <IconChevronsDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="px-1 py-1.5">
                    <div className="flex items-center gap-2">
                      {user && <UserAvatarProfile className="h-8 w-8 rounded-lg" user={user} />}
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user?.name || "User"}</span>
                        <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                        <Badge
                          variant="secondary"
                          className={`text-xs px-1 py-0 w-fit mt-1 `}
                        >
                          {/* {getRoleDisplayName(user?.role || user?.prefs?.role)} */}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                    <IconUserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconCreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconBell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <IconLogout className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
