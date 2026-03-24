
export interface InstrumentationAnnotation {
  id: number
  instrument_name: string
  position?: "LEFT" | "CENTER" | "RIGHT"
  start_time: number
  end_time?: number
  x_position: number
  y_position: number
  created_at?: string
  updated_at?: string
}

export interface CreateInstrumentationAnnotationData {
  timestamp?: number
  instrument: string
  action: string
  x_position?: number
  y_position?: number
  duration?: number
}

export interface UpdateInstrumentationAnnotationData extends Partial<CreateInstrumentationAnnotationData> {}
