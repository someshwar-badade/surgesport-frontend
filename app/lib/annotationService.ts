import apiClient from "~/api/apiClient"
import type {
  Annotation,
  PhaseAnnotation,
  EventAnnotation,
  BleedingAnnotation,
  InstrumentationAnnotation,
  AnomalyAnnotation,
} from "~/types/annotation.type"

export interface ApiResponse<T> {
  status: boolean
  message?: string
  data: T
  errors?: Record<string, string[]>
}

export interface AnnotationsByType {
  phases: PhaseAnnotation[]
  events: EventAnnotation[]
  bleeds: BleedingAnnotation[]
  instrumentation: InstrumentationAnnotation[]
  anomaly: AnomalyAnnotation[]
}

const makeDummyPhaseAnnotations = (count = 12): PhaseAnnotation[] => {
  const names = [
    "Preparation",
    "Incision",
    "Dissection",
    "Hemostasis",
    "Resection",
    "Suturing",
    "Inspection",
    "Closure",
    "Recovery",
    "Final Check",
  ]

  return Array.from({ length: count }, (_, idx) => ({
    id: idx + 1,
    phase_name: names[idx % names.length],
    start_time: idx * 50,
    end_time: idx * 50 + 40,
    created_at: new Date(Date.now() - (count - idx) * 60000).toISOString(),
    updated_at: new Date(Date.now() - (count - idx) * 60000).toISOString(),
  }))
}

const makeDummyEventAnnotations = (count = 12): EventAnnotation[] => {
  const events = [
    "Bleeding Started",
    "Suturing Started",
    "Instrument Change",
    "Camera Obstruction",
    "Unexpected Motion",
    "Tissue Adhesion",
    "Pressure Applied",
    "Alarm Triggered",
    "Equipment Check",
    "Gas Leak",
    "Communication",
    "Fastened",
  ]

  return Array.from({ length: count }, (_, idx) => ({
    id: idx + 1,
    event_type: events[idx % events.length],
    timestamp: idx * 30,
    x_position: 30 + (idx % 8) * 6,
    y_position: 40 + (idx % 6) * 7,
    created_at: new Date(Date.now() - (count - idx) * 50000).toISOString(),
    updated_at: new Date(Date.now() - (count - idx) * 50000).toISOString(),
  }))
}

const makeDummyBleedingAnnotations = (count = 12): BleedingAnnotation[] => {
  const severities = ["mild", "moderate", "severe"]

  return Array.from({ length: count }, (_, idx) => ({
    id: idx + 1,
    onset_time: idx * 40,
    severity: severities[idx % severities.length],
    intervention_time: idx * 40 + 15,
    x_position: 25 + (idx % 5) * 10,
    y_position: 35 + (idx % 5) * 10,
    created_at: new Date(Date.now() - (count - idx) * 45000).toISOString(),
    updated_at: new Date(Date.now() - (count - idx) * 45000).toISOString(),
  }))
}

const makeDummyInstrumentationAnnotations = (count = 12): InstrumentationAnnotation[] => {
  const instruments = ["Scalpel", "Forceps", "Suction", "Cautery", "Needle Holder", "Retractor", "Clip Applier", "Grasper", "Stapler", "Irrigator", "Endoscope", "Trocar"]
  const positions: ("LEFT" | "CENTER" | "RIGHT")[] = ["LEFT", "CENTER", "RIGHT"]

  return Array.from({ length: count }, (_, idx) => ({
    id: idx + 1,
    instrument_name: instruments[idx % instruments.length],
    position: positions[idx % positions.length],
    start_time: idx * 45,
    end_time: idx * 45 + 20,
    x_position: 20 + (idx % 7) * 9,
    y_position: 25 + (idx % 7) * 8,
    created_at: new Date(Date.now() - (count - idx) * 55000).toISOString(),
    updated_at: new Date(Date.now() - (count - idx) * 55000).toISOString(),
  }))
}

export async function getAnnotationsByVideoId(
  videoId: string,
  types: string[] = ["phases", "events", "bleeds", "instrumentation","anomaly"]
): Promise<AnnotationsByType> {
  const typesParam = types.join(",")
  try {
    const response = await apiClient.get<ApiResponse<AnnotationsByType>>(
      `/videos/${videoId}/annotations?types=${typesParam}`
    )

    if (!response.data.status) {
      throw new Error(response.data.message || "Failed to fetch annotations")
    }

    return {
      phases: response.data.data.phases ?? [],
      events: response.data.data.events ?? [],
      bleeds: response.data.data.bleeds ?? [],
      instrumentation: response.data.data.instrumentation ?? [],
      anomaly: response.data.data.anomaly ?? [],
    }
  } catch (error) {
    // Fallback sample data for local dev when API is unavailable
    return {
      phases: [],
      events: [],
      bleeds: [],
      instrumentation: [],
      anomaly: [],
    }
  }
}

export async function createPhaseAnnotation(
  videoId: string,
  data: Partial<PhaseAnnotation>
): Promise<PhaseAnnotation> {
  const response = await apiClient.post<ApiResponse<PhaseAnnotation>>(
    `/videos/${videoId}/phases`,
    data
  )
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create phase annotation")
  }
  return response.data.data
}

export async function createEventAnnotation(
  videoId: string,
  data: Partial<EventAnnotation>
): Promise<EventAnnotation> {
  const response = await apiClient.post<ApiResponse<EventAnnotation>>(
    `/videos/${videoId}/events`,
    data
  )
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create event annotation")
  }
  return response.data.data
}

export async function createBleedingAnnotation(
  videoId: string,
  data: Partial<BleedingAnnotation>
): Promise<BleedingAnnotation> {
  const response = await apiClient.post<ApiResponse<BleedingAnnotation>>(
    `/videos/${videoId}/bleedings`,
    data
  )
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create bleeding annotation")
  }
  return response.data.data
}

export async function createInstrumentationAnnotation(
  videoId: string,
  data: Partial<InstrumentationAnnotation>
): Promise<InstrumentationAnnotation> {
  const response = await apiClient.post<ApiResponse<InstrumentationAnnotation>>(
    `/videos/${videoId}/instruments`,
    data
  )
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create instrumentation annotation")
  }
  return response.data.data
}

export async function createAnomalyAnnotation(
  videoId: string,
  data: any
): Promise<Annotation> {
  const response = await apiClient.post<ApiResponse<Annotation>>(
    `/videos/${videoId}/anomalies`,
    data
  )
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create anomaly annotation")
  }
  return response.data.data
}

export async function createAnnotation(videoId: string, type: string, data: any): Promise<any> {
  const response = await apiClient.post<ApiResponse<any>>(`/videos/${videoId}/annotations`, { type, data })
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create annotation")
  }
  return response.data.data
}

export async function updateAnnotation(
  videoId: string,
  annotationId: number,
  type: string,
  data: any
): Promise<any> {
  const response = await apiClient.put<ApiResponse<any>>(
    `/videos/${videoId}/annotations/${annotationId}`,
    { type, data }
  )
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to update annotation")
  }
  return response.data.data
}

export async function deleteAnnotation(
  videoId: string,
  annotationId: number,
  category: string
): Promise<void> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/videos/${videoId}/${category}/${annotationId}`
  )
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to delete annotation")
  }
}

export async function getAnnotation(videoId: string, annotationId: number): Promise<any> {
  const response = await apiClient.get<ApiResponse<any>>(
    `/videos/${videoId}/annotations/${annotationId}`
  )
  if (!response.data.status) {
    throw new Error(response.data.message || "Annotation not found")
  }
  return response.data.data
}

