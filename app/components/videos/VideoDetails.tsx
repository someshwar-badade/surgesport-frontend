import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import type { Video } from "~/types/videos/video.type"

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
              Title
            </div>
            <p className="text-sm font-semibold">{video.title || "N/A"}</p>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Procedure Type
            </div>
            <p className="text-sm font-semibold">{video.procedure?.name || "N/A"}</p>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Total Video Time
            </div>
            <p className="text-sm font-semibold">
              {video.total_video_time ? `${video.total_video_time} seconds` : "N/A"}
            </p>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Video URL
            </div>
            <p className="text-sm font-semibold">
              {video.video_url ? (
                <a
                  href={video.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {video.video_url}
                </a>
              ) : (
                "N/A"
              )}
            </p>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Created
            </div>
            <p className="text-sm font-semibold">
              {video.created_at
                ? new Date(video.created_at).toLocaleString()
                : "N/A"}
            </p>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Last Updated
            </div>
            <p className="text-sm font-semibold">
              {video.updated_at
                ? new Date(video.updated_at).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
