"use client"

import * as React from "react"
import { IconDashboard, IconFolder, IconHighlight, IconInnerShadowTop, IconUsers, IconRoute   } from "@tabler/icons-react"

import { useAuth } from "~/context/authContext"
import { isAdmin, isResearcher, isStudent } from "~/lib/roles"
import { NavMain } from "~/components/nav-main"
import { NavUser } from "~/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const roleId = user?.role_id

  const navMainItems = React.useMemo(() => {
    if (isAdmin(roleId)) {
      return [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "Videos",
          url: "/videos",
          icon: IconFolder,
        },
        {
          title: "Annotations",
          url: "/videos/annotation",
          icon: IconHighlight,
        },
         {
          title: "Procedures",
          url: "/procedures",
          icon: IconRoute  ,
        },
        {
          title: "Users",
          url: "/users/all",
          icon: IconUsers,
        },
      ]
    }

    if (isResearcher(roleId)) {
      return [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "Videos",
          url: "/videos",
          icon: IconFolder,
        },
        {
          title: "Annotations",
          url: "/videos/annotation",
          icon: IconHighlight,
        },
      ]
    }

    if (isStudent(roleId)) {
      return [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "Annotations",
          url: "/videos/annotation",
          icon: IconHighlight,
        },
      ]
    }

    return []
  }, [roleId])

  const userInfo = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    avatar: "",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Surgesport</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo} />
      </SidebarFooter>
    </Sidebar>
  )
}
