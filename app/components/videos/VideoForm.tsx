import * as React from "react"
import type { Video, CreateVideoData } from "~/lib/videoService"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Field } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"

interface VideoFormProps {
  readonly initialData?: Partial<Video>
  readonly onSubmit: (data: CreateVideoData) => void
  readonly onCancel?: () => void
}

const PROCEDURE_OPTIONS = ["Endoscopy", "Colonoscopy", "ERCP", "Other"]

export function VideoForm({
  initialData = {},
  onSubmit,
  onCancel,
}: VideoFormProps) {
  const [procedureType, setProcedureType] = React.useState(
    initialData.procedure_type || PROCEDURE_OPTIONS[0]
  )
  const [title, setTitle] = React.useState(initialData.title || "")
  const [totalVideoTime, setTotalVideoTime] = React.useState(
    initialData.total_video_time?.toString() || ""
  )
  const [videoUrl, setVideoUrl] = React.useState(initialData.video_url || "")

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!procedureType) errs.procedure_type = "Procedure type is required"
    if (!title) errs.title = "Title is required"
    if (!totalVideoTime) errs.total_video_time = "Total video time is required"
    if (!videoUrl) errs.video_url = "Video URL is required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      procedure_type: procedureType,
      title: title,
      total_video_time: Number(totalVideoTime),
      video_url: videoUrl,
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
              {errors.procedure_type && (
                <p className="mt-1 text-xs text-red-500">{errors.procedure_type}</p>
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
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500">{errors.title}</p>
              )}
            </Field>

            <Field>
              <label htmlFor="totalVideoTime" className="text-sm font-medium">
                Total Video Time (seconds)
              </label>
              <Input
                id="totalVideoTime"
                type="number"
                value={totalVideoTime}
                onChange={(e) => setTotalVideoTime(e.target.value)}
                placeholder="e.g. 600"
                min="1"
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
