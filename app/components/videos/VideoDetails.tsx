import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import type { Video } from "~/lib/videoService"

interface VideoDetailsProps {
  readonly video?: Video
}

export function VideoDetails({ video }: VideoDetailsProps) {
  if (!video) {
    return (
      <Card className="h-full">
        <CardContent>
          <p className="text-muted-foreground">No video selected</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Video Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Video ID
            </div>
            <p className="text-sm font-semibold">{video.video_id}</p>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Procedure Type
            </div>
            <p className="text-sm font-semibold">{video.procedure_type}</p>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Total Video Time
            </div>
            <p className="text-sm font-semibold">{video.total_video_time}</p>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">
              OSAT Score
            </div>
            <p className="text-sm font-semibold">{video.osat_score}/100</p>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">
              First Camera Entry
            </div>
            <p className="text-sm font-semibold">
              {video.first_camera_entry_time
                ? new Date(video.first_camera_entry_time).toLocaleString()
                : "N/A"}
            </p>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Final Camera Exit
            </div>
            <p className="text-sm font-semibold">
              {video.final_camera_exit_time
                ? new Date(video.final_camera_exit_time).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
