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
  annotationType?: string
}

type ClickMarker = {
  id: string
  x: number
  y: number
  time: number
  annotationType: string
}

type Props = {
  readonly onCapture?: (data: CaptureData) => void
  readonly onDurationChange?: (duration: number) => void
  readonly seekTime?: number
  readonly selectedAnnotationType?: string
  readonly videoUrl?: string
  onTimeUpdate?: (currentTime: number) => void
}

export default function VideoPlayer({ onCapture, onDurationChange, seekTime, selectedAnnotationType = "phases", videoUrl, onTimeUpdate }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [markers, setMarkers] = useState<ClickMarker[]>([])

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

  const getAnnotationColor = (type: string): string => {
    const colors: Record<string, string> = {
      phases: "#3b82f6",      // Blue
      bleeds: "#ef4444",      // Red
      events: "#10b981",      // Green
      instruments: "#f59e0b", // Amber
      anomalies: "#8b5cf6",   // Purple
    }
    return colors[type] || "#6b7280" // Default gray
  }

  const getMarkerColor = (type?: string) => {
  switch (type) {
    case "phases":
      return "bg-blue-500"
    case "events":
      return "bg-green-500"
    case "bleeds":
      return "bg-red-500"
    case "instrumentation":
      return "bg-purple-500"
    case "anomaly":
      return "bg-orange-500"
    default:
      return "bg-white" // ✅ default
  }
}

  const handleVideoDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

  if (!videoRef.current || !onCapture) return

  // Ignore UI controls
  if ((e.target as HTMLElement).closest("button, input, select")) return

  const rect = e.currentTarget.getBoundingClientRect()

  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const xPercent = (x / rect.width) * 100
  const yPercent = (y / rect.height) * 100

  const id = crypto.randomUUID()

  const newMarker: ClickMarker = {
    id,
    x,
    y,
    time: videoRef.current.currentTime,
    annotationType: selectedAnnotationType,
  }
  console.log("Captured annotation at time:", newMarker.time, "with type:", newMarker.annotationType)

  setMarkers((prev) => [...prev, newMarker])
 // ✅ Auto remove after 2 seconds
  setTimeout(() => {
    setMarkers((prev) => prev.filter((m) => m.id !== id))
  }, 2000)
  onCapture({
    time: videoRef.current.currentTime,
    x,
    y,
    xPercent,
    yPercent,
    annotationType: selectedAnnotationType,
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
        className="relative aspect-video w-full bg-black"
        onDoubleClick={handleVideoDoubleClick}
      >
        <ReactPlayer
          ref={playerRef}
          src={videoUrl || "/videos/video-2.mp4"}
          width="100%"
          height="100%"
          playing={playing}
          playbackRate={playbackRate}
          controls={false}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onClick={(e:any) => {
            handlePlayPause();
          }}
          onLoadedMetadata={(e: any) => {
            const video = e.target as HTMLVideoElement

            videoRef.current = video
            setDuration(video.duration)
            onDurationChange?.(video.duration)

            const updateTime = () => {
              const time = video.currentTime
              setCurrentTime(time)
              onTimeUpdate?.(time) //
            }

            video.addEventListener("timeupdate", updateTime)

            // ✅ CLEANUP
            video.onended = () => setPlaying(false)

            return () => {
              video.removeEventListener("timeupdate", updateTime)
            }
          }}
        />

        {/* Annotation Markers */}
        {markers.map((marker) => (
        <div
          key={marker.id}
          className={`absolute w-3 h-3 rounded-full border border-black ${getMarkerColor(marker.annotationType)}`}
          style={{
            left: `${(marker.x / containerRef.current!.offsetWidth) * 100}%`,
            top: `${(marker.y / containerRef.current!.offsetHeight) * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
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