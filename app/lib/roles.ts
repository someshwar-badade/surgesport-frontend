export enum Role {
  Admin = 1,
  Student = 2,
  Researcher = 3,
}

export const getRoleId = (role?: number | string | null): number | undefined => {
  if (role === undefined || role === null) return undefined
  const parsed = Number(role)
  return Number.isFinite(parsed) ? parsed : undefined
}

export const isAdmin = (role?: number | string | null): boolean => {
  return getRoleId(role) === Role.Admin
}

export const isStudent = (role?: number | string | null): boolean => {
  return getRoleId(role) === Role.Student
}

export const isResearcher = (role?: number | string | null): boolean => {
  return getRoleId(role) === Role.Researcher
}

export const getDefaultRouteForRole = (role?: number | string | null): string => {
  if (isAdmin(role)) return "/dashboard"
  if (isResearcher(role)) return "/videos"
  if (isStudent(role)) return "/videos/annotation"
  return "/login"
}

export const isPathAllowedForRole = (role: number | string | null, path: string): boolean => {
  if (isAdmin(role)) return true

  const normalizedPath = path.split("?")[0].toLowerCase()

  if (isStudent(role)) {
    // Students only have access to the annotations pages.
    const allowedPaths = ["/videos/annotation", "/videos/annotation/view"]
    return allowedPaths.some((p) => normalizedPath === p || normalizedPath.startsWith(`${p}/`))
  }

  if (isResearcher(role)) {
    // Researchers can manage videos and annotations.
    return normalizedPath.startsWith("/videos")
  }

  return false
}
