import { useState } from "react"
import { SiteHeader } from "~/components/site-header"

export default function Dashboard() {
  const [capture, setCapture] = useState<any>(null)

  return (
    <>
      <SiteHeader breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]} />

      <div className="w-full flex-1 space-y-6 p-6">
        <h2>Dashboard</h2>
      </div>
    </>
  )
}
