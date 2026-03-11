import { Outlet } from "react-router"
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import { AppSidebar } from "~/components/app-sidebar"
import { ToastProvider } from "~/components/ui/toast"

export default function Layout() {
  return (
    <SidebarProvider>
      <ToastProvider>
        <div className="flex min-h-screen w-full">

        <AppSidebar />

        <main className="flex-1 flex flex-col">

          {/* Header */}
          <header className="h-14 flex items-center border-b px-4">
            <SidebarTrigger />
          </header>

          {/* Page Content */}
          <div className="flex-1 p-6 w-full">
            <Outlet />
          </div>

        </main>

      </div>
      </ToastProvider>
    </SidebarProvider>
  )
}