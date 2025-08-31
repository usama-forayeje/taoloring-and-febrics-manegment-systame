import KBar from "@/components/kbar"
import AppSidebar from "@/components/layout/app-sidebar"
import Header from "@/components/layout/header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"

export const metadata = {
  title: "Tailoring & Fabrics Dashboard",
  description: "Complete management system for tailoring and fabrics shop",
}

export default async function DashboardLayout({ children }) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  )
}
