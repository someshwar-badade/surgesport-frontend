import apiClient from "~/api/apiClient"
import type { Procedure } from "~/types/procedure.type"



export interface ApiResponse<T> {
  status: boolean
  message?: string
  data: T
  errors?: Record<string, string[]>
}
export async function getProcedures(): Promise<Procedure[]> {
  const response = await apiClient.get<ApiResponse<unknown>>("/procedures")

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to fetch procedures")
  }

  const payload = response.data.data

  // Normalize response payload
  if (Array.isArray(payload)) {
    return payload as Procedure[]
  }

  if (payload && typeof payload === "object") {
    if (Array.isArray((payload as any).procedures)) {
      return (payload as any).procedures as Procedure[]
    }

    if (Array.isArray((payload as any).data)) {
      return (payload as any).data as Procedure[]
    }
  }

  console.warn("Unexpected procedures payload format", payload)
  return []
}

export async function createProcedure(
  data: Omit<Procedure, "id">
): Promise<Procedure> {
  const response = await apiClient.post<ApiResponse<Procedure>>(
    "/procedures",
    data
  )

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create procedure")
  }

  return response.data.data
}

export async function updateProcedure(
  id: number,
  data: Partial<Procedure>
): Promise<Procedure> {
  const response = await apiClient.put<ApiResponse<Procedure>>(
    `/procedures/${id}`,
    data
  )

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to update procedure")
  }

  return response.data.data
}

export async function deleteProcedure(id: number): Promise<boolean> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/procedures/${id}`
  )

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to delete procedure")
  }

  return true
}