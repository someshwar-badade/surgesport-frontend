import apiClient from "~/api/apiClient"
import type { ApiResponse } from "~/types/apis/apiResponse.type"
import type { Procedure } from "~/types/procedure.type"
import { extractList } from "~/utils/helpers/extractListHelper"


export async function getProcedures(): Promise<Procedure[]> {
  const response = await apiClient.get<ApiResponse<unknown>>("/procedures")

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to fetch procedures")
  }

  return extractList<Procedure>(response.data.data);
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