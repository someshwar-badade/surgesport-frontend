export interface Video {
  id: string
  video_id: string
  procedure_type: string
  total_video_time: string
  first_camera_entry_time: string
  final_camera_exit_time: string
  camera_exit_body_time: string
  camera_enter_body_timestamp: string
  camera_exit_body_timestamp: string
  osat_score: number
  createdAt: string
}

const STORAGE_KEY = "videos";

function readStorage(): Video[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Video[];
  } catch {
    return [];
  }
}

function writeStorage(videos: Video[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
}

function delay<T>(result: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

export async function getVideos(): Promise<Video[]> {
  const videos = readStorage();
  return delay(videos);
}

export async function getVideoById(id: string): Promise<Video | undefined> {
  const videos = readStorage();
  return delay(videos.find((v) => v.id === id));
}

export async function createVideo(data: Omit<Video, "id" | "createdAt">): Promise<Video> {
  const videos = readStorage();
  const newVideo: Video = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  } as any;
  videos.unshift(newVideo);
  writeStorage(videos);
  return delay(newVideo);
}

export async function updateVideo(
  id: string,
  data: Partial<Omit<Video, "id" | "createdAt">>
): Promise<Video | undefined> {
  const videos = readStorage();
  const idx = videos.findIndex((v) => v.id === id);
  if (idx === -1) return delay(undefined);
  const updated = { ...videos[idx], ...data };
  videos[idx] = updated;
  writeStorage(videos);
  return delay(updated);
}

export async function deleteVideo(id: string): Promise<void> {
  let videos = readStorage();
  videos = videos.filter((v) => v.id !== id);
  writeStorage(videos);
  return delay(undefined as any);
}
