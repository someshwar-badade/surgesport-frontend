

import { SiteHeader } from "~/components/site-header"
import VideoPlayer from "~/components/video-player"

export default function Dashboard() {
  return (
    <>
    <SiteHeader breadcrumbs={[
      { label: "Dashboard", href: "/dashboard" }
    ]}/>
    <div className="flex-1 p-6 w-full">
      <VideoPlayer />
            
          </div>
          </>
  )
}
