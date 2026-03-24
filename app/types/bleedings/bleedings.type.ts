
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

export interface CreateBleedingAnnotationData {
  onset_time: number
  severity: string
  intervention_time?: number
  x_position: number
  y_position: number
}

export interface UpdateBleedingAnnotationData extends Partial<CreateBleedingAnnotationData> {}
