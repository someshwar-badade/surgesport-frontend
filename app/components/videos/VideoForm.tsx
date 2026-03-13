import * as React from "react"
import type { Video } from "~/lib/videoService"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Field } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"

interface VideoFormProps {
  readonly initialData?: Partial<Video>
  readonly onSubmit: (data: Omit<Video, "id" | "createdAt">) => void
  readonly onCancel?: () => void
}

const PROCEDURE_OPTIONS = ["Type A", "Type B", "Type C", "Other"]

export function VideoForm({
  initialData = {},
  onSubmit,
  onCancel,
}: VideoFormProps) {
  const [videoId, setVideoId] = React.useState(initialData.video_id || "")
  const [procedureType, setProcedureType] = React.useState(
    initialData.procedure_type || PROCEDURE_OPTIONS[0]
  )
  const [totalVideoTime, setTotalVideoTime] = React.useState(
    initialData.total_video_time || ""
  )
  const [firstEntry, setFirstEntry] = React.useState(
    initialData.first_camera_entry_time || ""
  )
  const [finalExit, setFinalExit] = React.useState(
    initialData.final_camera_exit_time || ""
  )
  const [exitBodyTime, setExitBodyTime] = React.useState(
    initialData.camera_exit_body_time || ""
  )
  const [enterBodyTime, setEnterBodyTime] = React.useState(
    initialData.camera_enter_body_timestamp || ""
  )
  const [exitBodyTimestamp, setExitBodyTimestamp] = React.useState(
    initialData.camera_exit_body_timestamp || ""
  )
  const [osatScore, setOsatScore] = React.useState(
    initialData.osat_score?.toString() || ""
  )

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!videoId) errs.video_id = "Video ID is required"
    if (!totalVideoTime) errs.total_video_time = "Total video time is required"
    if (!osatScore) errs.osat_score = "OSAT score is required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      video_id: videoId,
      procedure_type: procedureType,
      total_video_time: totalVideoTime,
      first_camera_entry_time: firstEntry,
      final_camera_exit_time: finalExit,
      camera_exit_body_time: exitBodyTime,
      camera_enter_body_timestamp: enterBodyTime,
      camera_exit_body_timestamp: exitBodyTimestamp,
      osat_score: Number(osatScore),
    })
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Video Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field>
              <label htmlFor="videoId" className="text-sm font-medium">
                Video ID
              </label>
              <Input
                id="videoId"
                type="text"
                value={videoId}
                onChange={(e) => setVideoId(e.target.value)}
                placeholder="Enter video ID"
              />
              {errors.video_id && (
                <p className="mt-1 text-xs text-red-500">{errors.video_id}</p>
              )}
            </Field>

            <Field>
              <label className="text-sm font-medium">Procedure Type</label>
              <select
                value={procedureType}
                onChange={(e) => setProcedureType(e.target.value)}
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
              >
                {PROCEDURE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>

            <Field>
              <label className="text-sm font-medium">Total Video Time</label>
              <Input
                type="text"
                placeholder="e.g. 00:05:30"
                value={totalVideoTime}
                onChange={(e) => setTotalVideoTime(e.target.value)}
              />
              {errors.total_video_time && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.total_video_time}
                </p>
              )}
            </Field>

            <Field>
              <label className="text-sm font-medium">
                First Camera Entry Time
              </label>
              <Input
                type="datetime-local"
                value={firstEntry}
                onChange={(e) => setFirstEntry(e.target.value)}
              />
            </Field>

            <Field>
              <label className="text-sm font-medium">
                Final Camera Exit Time
              </label>
              <Input
                type="datetime-local"
                value={finalExit}
                onChange={(e) => setFinalExit(e.target.value)}
              />
            </Field>

            <Field>
              <label className="text-sm font-medium">
                Camera Exit Body Time
              </label>
              <Input
                type="datetime-local"
                value={exitBodyTime}
                onChange={(e) => setExitBodyTime(e.target.value)}
              />
            </Field>

            <Field>
              <label className="text-sm font-medium">
                Camera Enter Body Timestamp
              </label>
              <Input
                type="datetime-local"
                value={enterBodyTime}
                onChange={(e) => setEnterBodyTime(e.target.value)}
              />
            </Field>

            <Field>
              <label className="text-sm font-medium">
                Camera Exit Body Timestamp
              </label>
              <Input
                type="datetime-local"
                value={exitBodyTimestamp}
                onChange={(e) => setExitBodyTimestamp(e.target.value)}
              />
            </Field>

            <Field>
              <label className="text-sm font-medium">OSAT Score</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={osatScore}
                onChange={(e) => setOsatScore(e.target.value)}
                placeholder="0-100"
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
