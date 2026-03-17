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

// Specific annotation types for API services
export interface PhaseAnnotation {
  id: number
  video_id: number
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  phaseName: string
  endTime?: number
  duration?: number
  note?: string
  created_at: string
  updated_at: string
}

export interface EventAnnotation {
  id: number
  video_id: number
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  eventName: string
  position?: "Left" | "Center" | "Right"
  note?: string
  created_at: string
  updated_at: string
}

export interface BleedingAnnotation {
  id: number
  video_id: number
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  severity: "mild" | "moderate" | "severe"
  interventionTime?: number
  note?: string
  created_at: string
  updated_at: string
}

export interface AnomalyAnnotation {
  id: number
  video_id: number
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  type: "anatomical" | "pathological" | "iatrogenic" | "other"
  description: string
  severity: "low" | "medium" | "high"
  note?: string
  created_at: string
  updated_at: string
}

export interface InstrumentationAnnotation {
  id: number
  video_id: number
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  instrument: string
  action: "inserted" | "removed" | "adjusted" | "malfunctioned"
  duration?: number
  note?: string
  created_at: string
  updated_at: string
}