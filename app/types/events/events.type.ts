
export interface EventAnnotation {
  id: number
  event_type: string
  x_position: number
  y_position: number
  created_at?: string
  updated_at?: string
}

export interface CreateEventAnnotationData {
  event_type: string
  x_position: number
  y_position: number
}

export interface UpdateEventAnnotationData extends Partial<CreateEventAnnotationData> {}
