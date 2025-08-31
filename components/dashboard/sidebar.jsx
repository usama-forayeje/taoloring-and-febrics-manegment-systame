"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShopSwitcher } from "./shop-switcher"
import { motion } from "framer-motion"
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Package,
    DollarSign,
    BarChart3,
    Settings,
    UserCog,
    Store,
    Calendar,
    Bell,
    X,
    CheckSquare,
    Clock,
    User,
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"

export function Sidebar({ isOpen, onClose }) {
    const { user } = useAuth()
    const pathname = usePathname()
    const isAdmin = user?.role === "superAdmin" || user?.role === "admin"
    const isManager = user?.role === "manager"
    const isWorker = ["tailor", "embroideryMan", "stoneMan"].includes(user?.role || "")

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag, hideFor: ["worker"] },
        { name: "Customers", href: "/dashboard/customers", icon: Users, hideFor: ["worker"] },
        { name: "Inventory", href: "/dashboard/inventory", icon: Package, hideFor: ["worker"] },
        { name: "Transactions", href: "/dashboard/transactions", icon: DollarSign, hideFor: ["worker"] },
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, hideFor: ["worker"] },
        { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
        { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    ]

    const workerNavigation = [
        { name: "My Tasks", href: "/dashboard/worker", icon: CheckSquare },
        { name: "Work Log", href: "/dashboard/work-log", icon: Clock },
        { name: "Profile", href: "/dashboard/profile", icon: User },
    ]

    const adminNavigation = [
        { name: "User Management", href: "/dashboard/users", icon: UserCog },
        { name: "Shop Management", href: "/dashboard/shops", icon: Store },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ]

    const managerNavigation = [
        { name: "Staff Management", href: "/dashboard/staff", icon: UserCog },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ]

    const userType = isAdmin ? "admin" : isManager ? "manager" : isWorker ? "worker" : "user"

    const filteredNavigation = navigation.filter((item) => !item.hideFor?.includes(userType))

    const isCurrentPath = (href) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard"
        }
        return pathname.startsWith(href)
    }

    return (
        <>
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
                        {!isWorker && <ShopSwitcher />}
                        {isWorker && (
                            <div className="flex items-center gap-2">
                                <Store className="h-4 w-4" />
                                <span className="font-medium">Worker Panel</span>
                            </div>
                        )}
                        <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <ScrollArea className="flex-1 px-3 py-4">
                        <nav className="space-y-2">
                            {filteredNavigation.map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Link href={item.href}>
                                        <Button
                                            variant={isCurrentPath(item.href) ? "secondary" : "ghost"}
                                            className={cn(
                                                "w-full justify-start gap-3 h-10",
                                                isCurrentPath(item.href) && "bg-sidebar-accent text-sidebar-accent-foreground",
                                            )}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.name}
                                        </Button>
                                    </Link>
                                </motion.div>
                            ))}

                            {isWorker && (
                                <>
                                    <div className="my-4 border-t border-sidebar-border" />
                                    <div className="px-2 py-2">
                                        <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                                            Worker Tools
                                        </h3>
                                    </div>
                                    {workerNavigation.map((item, index) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: (filteredNavigation.length + index) * 0.05 }}
                                        >
                                            <Link href={item.href}>
                                                <Button
                                                    variant={isCurrentPath(item.href) ? "secondary" : "ghost"}
                                                    className="w-full justify-start gap-3 h-10"
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    {item.name}
                                                </Button>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </>
                            )}

                            {(isAdmin || isManager) && !isWorker && (
                                <>
                                    <div className="my-4 border-t border-sidebar-border" />
                                    <div className="px-2 py-2">
                                        <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                                            {isAdmin ? "Administration" : "Management"}
                                        </h3>
                                    </div>
                                    {(isAdmin ? adminNavigation : managerNavigation).map((item, index) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: (filteredNavigation.length + index) * 0.05 }}
                                        >
                                            <Link href={item.href}>
                                                <Button
                                                    variant={isCurrentPath(item.href) ? "secondary" : "ghost"}
                                                    className="w-full justify-start gap-3 h-10"
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    {item.name}
                                                </Button>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </>
                            )}
                        </nav>
                    </ScrollArea>

                    {/* User info */}
                    <div className="border-t border-sidebar-border p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center">
                                <span className="text-sm font-medium text-sidebar-primary-foreground">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
                                <p className="text-xs text-sidebar-foreground/70 capitalize">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
