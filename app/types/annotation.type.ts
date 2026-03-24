import type { AnomalyAnnotation } from "./anomalies/anomalies.type"
import type { BleedingAnnotation } from "./bleedings/bleedings.type"
import type { EventAnnotation } from "./events/events.type"
import type { InstrumentationAnnotation } from "./instruments/instruments.type"
import type { PhaseAnnotation } from "./phases/phases.type"

export interface Annotation{
  id: string
  video_id: string
  timestamp: string
  time?: number | string
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
  createdAt: string
  updatedAt: string
}
export interface AnnotationsByType{
  phases: PhaseAnnotation[]
  events: EventAnnotation[]
  bleeds: BleedingAnnotation[]
  instrumentation: InstrumentationAnnotation[]
  anomaly: AnomalyAnnotation[]
}