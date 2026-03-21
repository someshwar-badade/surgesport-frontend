import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import type { Annotation } from "~/types/annotation.type"
import { formatSeconds } from "~/lib/utils"

interface AnnotationTimelineProps {
  annotations: Annotation[]
  videoDuration: number // in seconds
  currentTime: number
  onAnnotationClick?: (time: number) => void
}

const categoryColors = {
  phases: "bg-blue-500",
  events: "bg-green-500",
  bleeds: "bg-red-500",
  instrumentation: "bg-purple-500",
  anomaly: "bg-orange-500",
}

export function AnnotationTimeline({
  annotations,
  videoDuration,
  currentTime,
  onAnnotationClick,
}: AnnotationTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Annotation Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-8 w-full rounded bg-gray-200">
          {/* Timeline base */}
         
            <div
              className="absolute top-0 h-full w-[2px] bg-black z-50 pointer-events-none shadow-[0_0_6px_rgba(0,0,0,0.6)]"
              style={{
                left: `${(currentTime / videoDuration) * 100}%`,
                transition: "left 0.1s linear",
              }}
            />
          {/* Annotations */}
          {annotations.map((annotation) => {
            const leftPercent = (annotation.time / videoDuration) * 100
            const widthPercent = annotation.duration
              ? (annotation.duration / videoDuration) * 100
              : 0.5 // small marker for point annotations

            return (
              <div
                key={annotation.id}
                className={`absolute top-0 h-full ${categoryColors[annotation.category]} rounded opacity-80 cursor-pointer hover:opacity-100 transition-opacity`}
                style={{
                  left: `${leftPercent}%`,
                  width: `${widthPercent}%`,
                  minWidth: annotation.duration ? "auto" : "4px",
                }}
                title={`${annotation.category}: ${formatSeconds(annotation.time)}${annotation.duration ? ` - ${formatSeconds(annotation.endTime)}` : ""}`}
                onClick={() => onAnnotationClick?.(annotation.time)}
              >
                {!annotation.duration && (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="h-1 w-1 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Time markers */}
          <div className="absolute top-8 right-0 left-0 mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{formatSeconds(0)}</span>
            <span>{formatSeconds(Math.floor(videoDuration / 2))}</span>
            <span>{formatSeconds(videoDuration)}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center gap-1">
              <div className={`h-3 w-3 ${color} rounded`}></div>
              <span className="text-xs capitalize">{category}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
