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
  readonly onDurationChange?: (duration: number) => void
  readonly seekTime?: number
}

export default function VideoPlayer({ onCapture, onDurationChange, seekTime }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)

  const clampTime = (time: number) => {
    if (!Number.isFinite(time)) return 0
    return Math.max(0, Math.min(duration || 0, time))
  }

  const seekTo = (time: number) => {
    const safe = clampTime(time)
    const video = videoRef.current

    if (!video) return

    video.currentTime = safe
    setCurrentTime(safe)
  }

  const handlePlayPause = () => {
    setPlaying((prev) => !prev)
  }

  const handleRewind = () => {
    seekTo(currentTime - 10)
  }

  const handleForward = () => {
    seekTo(currentTime + 10)
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

  const handleVideoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !onCapture) return

    const rect = e.currentTarget.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const xPercent = (x / rect.width) * 100
    const yPercent = (y / rect.height) * 100

    onCapture({
      time: videoRef.current.currentTime,
      x,
      y,
      xPercent,
      yPercent,
    })
  }

  useEffect(() => {
    if (seekTime !== undefined) {
      seekTo(seekTime)
    }
  }, [seekTime])

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative aspect-video w-full"
        onClick={handleVideoClick}
      >
        <ReactPlayer
          ref={playerRef}
          src="/videos/video-2.mp4"
          width="100%"
          height="100%"
          controls={false}
          playing={playing}
          playbackRate={playbackRate}
          
          
          onLoadedMetadata={(e: any) => {
            const video = e.target as HTMLVideoElement

            videoRef.current = video
            setDuration(video.duration)
            onDurationChange?.(video.duration)

            const updateTime = () => {
                setCurrentTime(video.currentTime)
              }

              video.addEventListener("timeupdate", updateTime)
          }}
        />
      </div>

      {/* Controls */}
      <div className="mt-4 space-y-2">
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
          />

          <span className="font-mono text-sm">
            {formatTime(duration)}
          </span>
        </div>

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