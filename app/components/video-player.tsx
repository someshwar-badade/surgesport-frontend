import React, { useRef } from "react"
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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()

    const video = containerRef.current.querySelector("video")

    const currentTime = video ? video.currentTime : 0

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const xPercent = (x / rect.width) * 100
    const yPercent = (y / rect.height) * 100

    const data = {
      time: currentTime,
      x,
      y,
      xPercent,
      yPercent,
    }

    onCapture?.(data)
  }

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{ width: "640px", height: "360px", position: "relative" }}
    >
      <ReactPlayer
        src="/videos/video-1.mp4"
        width="100%"
        height="100%"
        controls
      />
    </div>
  )
}