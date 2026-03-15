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
  // Use 'any' for playerRef to access instance methods like seekTo and getInternalPlayer
  const playerRef = useRef<any>(null)

  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)

  // Returns the internal player for advanced use (YouTube, file, etc.)
  const getInternalPlayer = () => playerRef.current?.getInternalPlayer?.();

  const handlePlayPause = () => {
    setPlaying((prev) => !prev)
  }

  const clampTime = (time: number) => {
    if (!Number.isFinite(time)) return 0
    return Math.max(0, Math.min(duration || 0, time))
  }

  const seekTo = (time: number) => {
    const safe = clampTime(time);
    console.log(`Seeking to ${safe} seconds`)
    // Use ReactPlayer's seekTo for all sources
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(safe, "seconds");
    } else {
      // fallback for native video (shouldn't be needed)
      const internal = getInternalPlayer();
      if (internal && typeof internal.currentTime === "number") {
        internal.currentTime = safe;
      }
    }
    setCurrentTime(safe);
  }

  const handleRewind = () => {
    // Get the actual current time from the player if possible
    let actualTime = currentTime;
    if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
      actualTime = playerRef.current.getCurrentTime();
    }
    console.log("Rewind 10 seconds", { actualTime });
    seekTo(actualTime - 10);
  }

  const handleForward = () => {
    let actualTime = currentTime;
    if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
      actualTime = playerRef.current.getCurrentTime();
    }
    console.log("forward 10 seconds", { actualTime });
    seekTo(actualTime + 10);
  }

  const handleProgress = (state: { playedSeconds: number }) => {
    const t = Number(state.playedSeconds)
    if (Number.isFinite(t)) setCurrentTime(t)
  }

  const handleSeek = (value: number) => {
    console.log("Seeking to", value)
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

    // Removed attachListener and getVideoElement logic. If you need to capture clicks, use ReactPlayer's onClick or overlay a div.

    // No need for polling or attaching listeners to the internal video element
  }, [onCapture])

  return (
    <div className="w-full">
      <div ref={containerRef} className="relative aspect-video w-full">
        <ReactPlayer
          ref={playerRef}
          src="https://www.youtube.com/watch?v=CT_WEGUKejQ"
          width="100%"
          height="100%"
          controls={false}
          playing={playing}
          playbackRate={playbackRate}
          onProgress={handleProgress as any}
          onDurationChange={(e: Event) => {
            const video = e.target as HTMLVideoElement
            const duration = video.duration

            console.log("Video duration:", duration)

            if (Number.isFinite(duration)) {
              setDuration(duration)
            }
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