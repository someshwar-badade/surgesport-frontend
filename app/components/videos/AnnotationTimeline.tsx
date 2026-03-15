import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

type Annotation = {
  id: string
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  category: "phases" | "events" | "bleeds" | "instrumentation" | "anomaly"
  phaseName?: string
  endTime?: number
  duration?: number
  eventName?: string
  interventionTime?: number
  severity?: "mild" | "moderate" | "severe"
  instrumentName?: string
  position?: "Left" | "Center" | "Right"
  description?: string
  note?: string
}

interface AnnotationTimelineProps {
  annotations: Annotation[]
  videoDuration: number // in seconds
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
}: AnnotationTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Annotation Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-8 w-full rounded bg-gray-200">
          {/* Timeline base */}
          <div className="absolute inset-0 rounded bg-gray-300"></div>

          {/* Annotations */}
          {annotations.map((annotation) => {
            const leftPercent = (annotation.time / videoDuration) * 100
            const widthPercent = annotation.duration
              ? (annotation.duration / videoDuration) * 100
              : 0.5 // small marker for point annotations

            return (
              <div
                key={annotation.id}
                className={`absolute top-0 h-full ${categoryColors[annotation.category]} rounded opacity-80`}
                style={{
                  left: `${leftPercent}%`,
                  width: `${widthPercent}%`,
                  minWidth: annotation.duration ? "auto" : "4px",
                }}
                title={`${annotation.category}: ${annotation.time}s${annotation.duration ? ` - ${annotation.duration}s` : ""}`}
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
            <span>0s</span>
            <span>{Math.floor(videoDuration / 2)}s</span>
            <span>{videoDuration}s</span>
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
