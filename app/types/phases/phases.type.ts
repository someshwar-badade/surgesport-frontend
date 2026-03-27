

export interface PhaseAnnotation {
  id: number
  phase_name: string
  start_time: number
  end_time?: number
  duration?: number
  created_at?: string
  updated_at?: string
}

export interface CreatePhaseAnnotationData {
  phase_name: string
  start_time: number
  end_time: number
}

export interface UpdatePhaseAnnotationData extends Partial<CreatePhaseAnnotationData> {}