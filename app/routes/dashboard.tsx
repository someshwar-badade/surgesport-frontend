import { useState } from "react"
import { SiteHeader } from "~/components/site-header"
import VideoPlayer from "~/components/video-player"

export default function Dashboard() {
  const [capture, setCapture] = useState<any>(null)

  return (
    <>
      <SiteHeader breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]} />

      <div className="w-full flex-1 space-y-6 p-6">
        <VideoPlayer onCapture={setCapture} />

        {capture && (
          <div className="rounded border bg-gray-50 p-4">
            <h2 className="mb-2 font-semibold">Captured Data</h2>

            <div>Time: {capture.time.toFixed(2)} sec</div>
            <div>X: {capture.x}</div>
            <div>Y: {capture.y}</div>
            <div>X %: {capture.xPercent.toFixed(2)}%</div>
            <div>Y %: {capture.yPercent.toFixed(2)}%</div>
          </div>
        )}
      </div>
    </>
  )
}
