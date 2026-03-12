import {  Outlet } from "react-router"
import { SidebarProvider } from "~/components/ui/sidebar"
import { AppSidebar } from "~/components/app-sidebar"
import { ToastProvider } from "~/components/ui/toast"

export default function Layout() {
  return (
    <SidebarProvider>
      <ToastProvider>
        <div className="flex min-h-screen w-full">

        <AppSidebar />

        <main className="flex-1 flex flex-col">


          {/* Page Content */}
          <Outlet />
          

        </main>

      </div>
      </ToastProvider>
    </SidebarProvider>
  )
}