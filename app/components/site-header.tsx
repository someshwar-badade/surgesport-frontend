import { NavLink } from "react-router"
import { SidebarTrigger } from "~/components/ui/sidebar"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"

type BreadcrumbItemType = {
  label: string
  href?: string
}

type SiteHeaderProps = {
  breadcrumbs: BreadcrumbItemType[]
}

export function SiteHeader({ breadcrumbs }: SiteHeaderProps) {
  return (
    <header className="flex h-14 items-center gap-3 border-b px-4">
      <SidebarTrigger />

      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <NavLink to={item.href}>{item.label}</NavLink>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>

              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
