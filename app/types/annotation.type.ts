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
  phase_name: string
  start_time: number
  end_time?: number
  created_at?: string
  updated_at?: string
}

export interface EventAnnotation {
  id: number
  event_type: string
  timestamp: number
  x_position: number
  y_position: number
  created_at?: string
  updated_at?: string
}

export interface BleedingAnnotation {
  id: number
  onset_time: number
  severity: string
  intervention_time?: number
  x_position: number
  y_position: number
  created_at?: string
  updated_at?: string
}

export interface AnomalyAnnotation {
  id: number
  timestamp: number
  description: string
  x_position: number
  y_position: number
  type?: string
  severity?: string
  created_at?: string
  updated_at?: string
}

export interface InstrumentationAnnotation {
  id: number
  instrument_name: string
  position: "LEFT" | "CENTER" | "RIGHT"
  start_time: number
  end_time?: number
  x_position: number
  y_position: number
  created_at?: string
  updated_at?: string
}