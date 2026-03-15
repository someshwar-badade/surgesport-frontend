import React, { useEffect, useRef, useState } from "react"
import { default as ReactPlayer } from "react-player"
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
  // Use 'any' for playerRef to access instance methods like seekTo and getInternalPlayer
  const playerRef = useRef<any>(null)

  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)

  const getVideoElement = (): HTMLVideoElement | null => {
    const internal = playerRef.current?.getInternalPlayer?.()

    if (internal instanceof HTMLVideoElement) return internal

    return containerRef.current?.querySelector("video") || null
  }

  const handlePlayPause = () => {
    setPlaying((prev) => !prev)
  }

  const clampTime = (time: number) => {
    if (!Number.isFinite(time)) return 0
    return Math.max(0, Math.min(duration || 0, time))
  }

  const seekTo = (time: number) => {
    const safe = clampTime(time)

    playerRef.current?.seekTo(safe, "seconds")

    const video = getVideoElement()
    if (video) video.currentTime = safe

    setCurrentTime(safe)
  }

  const handleRewind = () => {
    seekTo(currentTime - 10)
  }

  const handleForward = () => {
    seekTo(currentTime + 10)
  }

  const handleProgress = (state: { playedSeconds: number }) => {
    const t = Number(state.playedSeconds)
    if (Number.isFinite(t)) setCurrentTime(t)
  }

  const handleSeek = (value: number) => {
    seekTo(value)
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

    const attachListener = () => {
      const video = getVideoElement()
      if (!video) return

      const onClick = (e: MouseEvent) => {
        const rect = video.getBoundingClientRect()

        const y = e.clientY - rect.top
        const controlAreaThreshold = 40

        if (y > rect.height - controlAreaThreshold) return

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
    }

    const timer = setInterval(() => {
      const video = getVideoElement()
      if (video) {
        attachListener()
        clearInterval(timer)
      }
    }, 300)

    return () => clearInterval(timer)
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
          onProgress={handleProgress as any}
          onDuration={(d: number) => {
            if (Number.isFinite(d)) setDuration(d)
          }}
        />
      </div>

      {/* Controls */}
      <div className="mt-4 space-y-2">
        {/* Progress */}
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sm">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 h-2"
            aria-label="Seek video"
          />

          <span className="font-mono text-sm">
            {formatTime(duration)}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleRewind}>
            <SkipBack className="h-4 w-4 mr-1" />
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
            <SkipForward className="h-4 w-4 mr-1" />
            10s
          </Button>

          {/* Speed */}
          <select
            value={playbackRate}
            onChange={(e) =>
              setPlaybackRate(Number.parseFloat(e.target.value))
            }
            className="rounded border px-2 py-1 text-sm"
          >
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={5}>5x</option>
            <option value={10}>10x</option>
          </select>
        </div>
      </div>
    </div>
  )
}