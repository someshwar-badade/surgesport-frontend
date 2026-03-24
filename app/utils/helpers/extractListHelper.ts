export const extractList = <T>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload

  if (payload?.data && Array.isArray(payload.data)) {
    return payload.data
  }

  if (payload?.videos && Array.isArray(payload.videos)) {
    return payload.videos
  }

  console.warn("Unexpected API format:", payload)
  return []
}
