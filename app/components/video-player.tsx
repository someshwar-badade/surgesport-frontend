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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      // Prevent scrolling when space is pressed
      e.preventDefault()
      // Simulate click
      handleClick(
        // @ts-ignore: create a fake MouseEvent-like object for compatibility
        {
          clientX: 0,
          clientY: 0,
          currentTarget: containerRef.current,
        } as React.MouseEvent<HTMLDivElement>
      )
    }
  }

  return (
    <button
      ref={containerRef as React.Ref<HTMLButtonElement>}
      onClick={handleClick as any}
      onKeyDown={handleKeyDown}
      aria-label="Video player area"
      className="relative aspect-video w-full cursor-pointer border-none bg-none p-0 outline-none"
    >
      <ReactPlayer
        src="/videos/video-1.mp4"
        width="100%"
        height="100%"
        controls
      />
    </button>
  )
}
