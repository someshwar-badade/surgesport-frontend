import React, { useEffect, useRef, useState } from "react"
import ReactPlayer from "react-player"
import { Button } from "~/components/ui/button"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"

type CaptureData = {
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
}

type Props = {
  readonly onCapture?: (data: CaptureData) => void
}

export default function VideoPlayer({ onCapture }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)

  const getVideoElement = () => {
    const internal = playerRef.current?.getInternalPlayer?.()
    if (internal instanceof HTMLVideoElement) return internal
    return containerRef.current?.querySelector<HTMLVideoElement>("video")
  }

  const handlePlayPause = () => {
    setPlaying((current) => !current)
  }

  const clampTime = (time: number) => {
    if (!Number.isFinite(time)) return 0
    return Math.max(0, Math.min(duration || 0, time))
  }

  const seekTo = (time: number) => {
    const safe = clampTime(time)
    const video = getVideoElement()

    if (video) {
      video.currentTime = safe
    } else {
      playerRef.current?.seekTo?.(safe, "seconds")
    }

    setCurrentTime(safe)
  }

  const handleRewind = () => {
    const safeCurrent = clampTime(currentTime)
    seekTo(Math.max(0, safeCurrent - 10))
  }

  const handleForward = () => {
    const safeCurrent = clampTime(currentTime)
    seekTo(Math.min(duration || 0, safeCurrent + 10))
  }

  const handleProgress = (state: any) => {
    const playedSeconds = Number(state.playedSeconds)
    setCurrentTime(Number.isFinite(playedSeconds) ? playedSeconds : 0)
  }

  const handleSeek = (value: number[]) => {
    const target = Number(value[0])
    seekTo(Number.isFinite(target) ? target : 0)
  }

  const formatTime = (time: number) => {
    if (!Number.isFinite(time) || time < 0) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

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
    <div className="w-full">
      <div ref={containerRef} className="relative aspect-video w-full">
        <ReactPlayer
          ref={playerRef}
          src="/videos/video-2.mp4"
          width="100%"
          height="100%"
          controls={false}
          playing={playing}
          playbackRate={playbackRate}
          onProgress={handleProgress}
          // ReactPlayer does not always expose `onDuration` in types, so we use the video element as a fallback.
          // @ts-expect-error: ReactPlayer exposes onDuration, but types may be incorrect.
          onDuration={(d: number) => {
            if (Number.isFinite(d) && d > 0) setDuration(d)
          }}
          onReady={() => {
            const video = getVideoElement()
            if (video && Number.isFinite(video.duration)) {
              setDuration(video.duration)
            }
          }}
        />
      </div>

      {/* Custom Controls */}
      <div className="mt-4 space-y-2">
        {/* Progress Bar */}
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sm">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => handleSeek([Number.parseFloat(e.target.value)])}
            className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
          />
          <span className="font-mono text-sm">{formatTime(duration)}</span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleRewind}>
            <SkipBack className="h-4 w-4" />
            10s
          </Button>

          <Button variant="outline" size="sm" onClick={handlePlayPause}>
            {playing ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={handleForward}>
            <SkipForward className="h-4 w-4" />
            10s
          </Button>

          {/* Playback Speed */}
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(Number.parseFloat(e.target.value))}
            className="rounded border px-2 py-1 text-sm"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>
    </div>
  )
}
