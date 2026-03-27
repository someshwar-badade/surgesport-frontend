
export interface AnomalyAnnotation{
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

export interface CreateAnomalyAnnotationData{
  timestamp: number
  description: string
  x_position: number
  y_position: number
  type?: string
  severity?: string
}

export interface UpdateAnomalyAnnotationData extends Partial<CreateAnomalyAnnotationData> {}
