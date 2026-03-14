import React, { useEffect, useRef } from "react"
import ReactPlayer from "react-player"

type CaptureData = {
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
}

type Props = {
  onCapture?: (data: CaptureData) => void
}

export default function VideoPlayer({ onCapture }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const video = container.querySelector<HTMLVideoElement>("video")
    if (!video) return

    const onClick = (e: MouseEvent) => {
      // Only capture when clicking the video surface (not the control bar)
      const rect = video.getBoundingClientRect()
      const y = e.clientY - rect.top
      const controlAreaThreshold = 40 // px from bottom where native controls live
      if (y > rect.height - controlAreaThreshold) return

      e.preventDefault()

      const x = e.clientX - rect.left
      const xPercent = (x / rect.width) * 100
      const yPercent = (y / rect.height) * 100

      onCapture?.({
        time: video.currentTime,
        x,
        y,
        xPercent,
        yPercent,
      })
    }

    video.addEventListener("click", onClick)
    return () => video.removeEventListener("click", onClick)
  }, [onCapture])

  return (
    <div ref={containerRef} className="relative aspect-video w-full">
      <ReactPlayer
        src="/videos/video-2.mp4"
        width="100%"
        height="100%"
        controls
      />
    </div>
  )
}
