export interface Annotation {
  id: string
  video_id: string
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
  createdAt: string
  updatedAt: string
}