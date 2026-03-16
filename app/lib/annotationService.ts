import type { Annotation } from "~/types/annotation.type"

const STORAGE_KEY = "annotations"

function readStorage(): Annotation[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Annotation[]
  } catch {
    return []
  }
}

function writeStorage(annotations: Annotation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations))
}

function delay<T>(result: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms))
}

export async function getAnnotations(): Promise<Annotation[]> {
  const annotations = readStorage()
  return delay(annotations)
}

export async function getAnnotationsByVideoId(videoId: string): Promise<Annotation[]> {
  const annotations = readStorage()
  return delay(annotations.filter((a) => a.video_id === videoId))
}

export async function getAnnotationById(id: string): Promise<Annotation | undefined> {
  const annotations = readStorage()
  return delay(annotations.find((a) => a.id === id))
}

export async function createAnnotation(
  data: Omit<Annotation, "id" | "createdAt" | "updatedAt">
): Promise<Annotation> {
  const annotations = readStorage()
  const now = new Date().toISOString()
  const newAnnotation: Annotation = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
  annotations.push(newAnnotation)
  writeStorage(annotations)
  return delay(newAnnotation)
}

export async function updateAnnotation(
  id: string,
  data: Partial<Omit<Annotation, "id" | "createdAt" | "updatedAt">>
): Promise<Annotation | undefined> {
  const annotations = readStorage()
  const idx = annotations.findIndex((a) => a.id === id)
  if (idx === -1) return delay(undefined)

  const updated = {
    ...annotations[idx],
    ...data,
    updatedAt: new Date().toISOString()
  }
  annotations[idx] = updated
  writeStorage(annotations)
  return delay(updated)
}

export async function deleteAnnotation(id: string): Promise<void> {
  let annotations = readStorage()
  annotations = annotations.filter((a) => a.id !== id)
  writeStorage(annotations)
  return delay(undefined as any)
}

export async function deleteAnnotationsByVideoId(videoId: string): Promise<void> {
  let annotations = readStorage()
  annotations = annotations.filter((a) => a.video_id !== videoId)
  writeStorage(annotations)
  return delay(undefined as any)
}