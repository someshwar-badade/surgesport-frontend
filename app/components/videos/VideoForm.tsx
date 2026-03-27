import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Field } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import apiClient from "~/api/apiClient"
import type { CreateVideoData, Video } from "~/types/videos/video.type"

interface Procedure {
  id: string | number
  name: string
}

interface VideoFormProps {
  readonly initialData?: Partial<Video>
  readonly onSubmit: (data: CreateVideoData) => void
  readonly onCancel?: () => void
}

export function VideoForm({
  initialData = {},
  onSubmit,
  onCancel,
}: VideoFormProps) {
  const [procedures, setProcedures] = React.useState<Procedure[]>([])
  const [procedureId, setProcedureId] = React.useState(
    initialData.procedure_id?.toString() || ""
  )
  const [loading, setLoading] = React.useState(true)
  const [title, setTitle] = React.useState(initialData.title || "")
  const [totalVideoTime, setTotalVideoTime] = React.useState(
    initialData.total_video_time || ""
  )
  const [firstCameraEntryTime, setFirstCameraEntryTime] = React.useState(
    initialData.first_camera_entry_time || ""
  )
  const [finalCameraExitTime, setFinalCameraExitTime] = React.useState(
    initialData.final_camera_exit_time || ""
  )
  
  const [cameraEnterBodyTimestamp, setCameraEnterBodyTimestamp] = React.useState(
    initialData.camera_enter_body_timestamp?.toString() || ""
  )
  const [cameraExitBodyTimestamp, setCameraExitBodyTimestamp] = React.useState(
    initialData.camera_exit_body_timestamp?.toString() || ""
  )
  const [osatScore, setOsatScore] = React.useState(
    initialData.osat_score?.toString() || ""
  )
  const [videoUrl, setVideoUrl] = React.useState(initialData.video_url || "")

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Fetch procedures from API on component mount
  React.useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const response = await apiClient.get("/procedures")
        setProcedures(response.data.data || [])
        // Set first procedure as default if not provided
        if (!initialData.procedure_id && response.data.data?.length > 0) {
          setProcedureId(response.data.data[0].id.toString())
        }
      } catch (error) {
        console.error("Failed to fetch procedures:", error)
        // Fallback to empty array if API fails
        setProcedures([])
      } finally {
        setLoading(false)
      }
    }

    fetchProcedures()
  }, [])

  const isValidTime = (value: string) => {
    if (!value) return true
    // Accept HH:MM:SS (24hr) format
    return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value)
  }

  const isValidUrl = (value: string) => {
    try {
      // eslint-disable-next-line no-new
      new URL(value)
      return true
    } catch {
      return false
    }
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!procedureId) errs.procedure_id = "Procedure type is required"
    if (!title) errs.title = "Title is required"
    if (!totalVideoTime) {
      errs.total_video_time = "Total video time is required"
    } else if (!isValidTime(totalVideoTime)) {
      errs.total_video_time = "Total video time must be in HH:MM:SS format"
    }

    if (firstCameraEntryTime && !isValidTime(firstCameraEntryTime)) {
      errs.first_camera_entry_time = "Must be in HH:MM:SS format"
    }
    if (finalCameraExitTime && !isValidTime(finalCameraExitTime)) {
      errs.final_camera_exit_time = "Must be in HH:MM:SS format"
    }
    

    // if (cameraEnterBodyTimestamp && Number.isNaN(Number(cameraEnterBodyTimestamp))) {
    //   errs.camera_enter_body_timestamp = "Must be a number"
    // }
    // if (cameraExitBodyTimestamp && Number.isNaN(Number(cameraExitBodyTimestamp))) {
    //   errs.camera_exit_body_timestamp = "Must be a number"
    // }

    if (osatScore && Number.isNaN(Number(osatScore))) {
      errs.osat_score = "Must be a number"
    }

    if (!videoUrl) {
      errs.video_url = "Video URL is required"
    } else if (!isValidUrl(videoUrl)) {
      errs.video_url = "Video URL must be valid"
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      procedure_id: Number(procedureId),
      title: title,
      total_video_time: totalVideoTime,
      first_camera_entry_time: firstCameraEntryTime || undefined,
      final_camera_exit_time: finalCameraExitTime || undefined,
      camera_enter_body_timestamp: cameraEnterBodyTimestamp
        ? cameraEnterBodyTimestamp.toString()
        : undefined,
      camera_exit_body_timestamp: cameraExitBodyTimestamp
        ? cameraExitBodyTimestamp.toString()
        : undefined,
      osat_score: osatScore ? Number(osatScore) : undefined,
      video_url: videoUrl,
    })
  }

  const formatTime = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 6);

  const h = digits.substring(0, 2);
  const m = digits.substring(2, 4);
  const s = digits.substring(4, 6);

  let formatted = "";

  if (h) formatted += h;
  if (m) formatted += ":" + m;
  if (s) formatted += ":" + s;

  return formatted;
};

const handleTimeChange = (
  value: string,
  setter: React.Dispatch<React.SetStateAction<string>>
) => {
  setter(formatTime(value));
};

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Video Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field>
              <label className="text-sm font-medium">Procedure Type</label>
              <select
                value={procedureId}
                onChange={(e) => setProcedureId(e.target.value)}
                disabled={loading}
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
              >
                <option value="" disabled>
                  {loading ? "Loading procedures..." : "Select a procedure"}
                </option>
                {procedures.map((proc) => (
                  <option key={proc.id} value={proc.id.toString()}>
                    {proc.name}
                  </option>
                ))}
              </select>
              {errors.procedure_id && (
                <p className="mt-1 text-xs text-red-500">{errors.procedure_id}</p>
              )}
            </Field>

            <Field>
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                maxLength={50}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500">{errors.title}</p>
              )}
            </Field>

            <Field>
              <label htmlFor="totalVideoTime" className="text-sm font-medium">
                Total Video Time (HH:MM:SS)
              </label>
              <Input
                id="totalVideoTime"
                type="text"
                value={totalVideoTime}
                onChange={(e) => handleTimeChange(e.target.value, setTotalVideoTime)}
                placeholder="e.g. 00:10:00"
              />
              {errors.total_video_time && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.total_video_time}
                </p>
              )}
            </Field>

            <Field>
              <label htmlFor="videoUrl" className="text-sm font-medium">
                Video URL
              </label>
              <Input
                id="videoUrl"
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://example.com/video.mp4"
              />
              {errors.video_url && (
                <p className="mt-1 text-xs text-red-500">{errors.video_url}</p>
              )}
            </Field>

            <Field>
              <label htmlFor="firstCameraEntryTime" className="text-sm font-medium">
                First Camera Entry Time (HH:MM:SS)
              </label>
              <Input
                id="firstCameraEntryTime"
                type="text"
                value={firstCameraEntryTime}
                onChange={(e) => handleTimeChange(e.target.value, setFirstCameraEntryTime)}
                placeholder="e.g. 00:00:10"
              />
              {errors.first_camera_entry_time && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.first_camera_entry_time}
                </p>
              )}
            </Field>

            <Field>
              <label htmlFor="finalCameraExitTime" className="text-sm font-medium">
                Final Camera Exit Time (HH:MM:SS)
              </label>
              <Input
                id="finalCameraExitTime"
                type="text"
                value={finalCameraExitTime}
                onChange={(e) => handleTimeChange(e.target.value, setFinalCameraExitTime)}
                placeholder="e.g. 00:09:50"
              />
              {errors.final_camera_exit_time && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.final_camera_exit_time}
                </p>
              )}
            </Field>

            <Field>
              <label
                htmlFor="cameraEnterBodyTimestamp"
                className="text-sm font-medium"
              >
                Camera Enter Body Timestamp
              </label>
              <Input
                id="cameraEnterBodyTimestamp"
                type="datetime-local"
                value={cameraEnterBodyTimestamp}
                onChange={(e) => setCameraEnterBodyTimestamp(e.target.value)}
                placeholder=""
                min="0"
              />
              {errors.camera_enter_body_timestamp && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.camera_enter_body_timestamp}
                </p>
              )}
            </Field>

            <Field>
              <label
                htmlFor="cameraExitBodyTimestamp"
                className="text-sm font-medium"
              >
                
                Camera Exit Body Timestamp
              </label>
              <Input
                id="cameraExitBodyTimestamp"
                type="datetime-local"
                value={cameraExitBodyTimestamp}
                onChange={(e) => setCameraExitBodyTimestamp(e.target.value)}
                placeholder="e.g. 130"
                min="0"
              />
              {errors.camera_exit_body_timestamp && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.camera_exit_body_timestamp}
                </p>
              )}
            </Field>

            <Field>
              <label htmlFor="osatScore" className="text-sm font-medium">
                OSAT Score (numeric)
              </label>
              <Input
                id="osatScore"
                type="number"
                value={osatScore}
                onChange={(e) => setOsatScore(e.target.value)}
                placeholder="e.g. 85"
                min="0"
              />
              {errors.osat_score && (
                <p className="mt-1 text-xs text-red-500">{errors.osat_score}</p>
              )}
            </Field>

            
          </div>

          <div className="flex justify-end gap-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
