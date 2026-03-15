import { SiteHeader } from "~/components/site-header"
import VideoPlayer from "~/components/video-player"
import { VideoDetails } from "~/components/videos/VideoDetails"
import { AnnotationDetails } from "~/components/videos/AnnotationDetails"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Card, CardContent } from "~/components/ui/card"
import { AnnotationTimeline } from "~/components/videos/AnnotationTimeline"

// Sample annotation data for viewing
const sampleAnnotations = [
  {
    id: "1",
    timestamp: "2024-01-01T10:00:15Z",
    time: 15,
    x: 100,
    y: 200,
    xPercent: 25,
    yPercent: 50,
    category: "phases" as const,
    phaseName: "Incision",
    endTime: 45,
    duration: 30,
  },
  {
    id: "2",
    timestamp: "2024-01-01T10:00:30Z",
    time: 30,
    x: 150,
    y: 250,
    xPercent: 37.5,
    yPercent: 62.5,
    category: "events" as const,
    eventName: "Bleeding Started",
  },
  {
    id: "3",
    timestamp: "2024-01-01T10:01:00Z",
    time: 60,
    x: 200,
    y: 300,
    xPercent: 50,
    yPercent: 75,
    category: "bleeds" as const,
    interventionTime: 60,
    severity: "moderate" as const,
  },
  {
    id: "4",
    timestamp: "2024-01-01T10:01:30Z",
    time: 90,
    x: 250,
    y: 350,
    xPercent: 62.5,
    yPercent: 87.5,
    category: "instrumentation" as const,
    instrumentName: "Scalpel",
    position: "Center" as const,
    endTime: 120,
    duration: 30,
  },
  {
    id: "5",
    timestamp: "2024-01-01T10:02:00Z",
    time: 120,
    x: 300,
    y: 400,
    xPercent: 75,
    yPercent: 100,
    category: "anomaly" as const,
    description: "Unexpected tissue response",
    note: "Monitor closely",
  },
]

// Mock video data
const mockVideo = {
  id: "1",
  video_id: "VID-001",
  procedure_type: "Type A",
  total_video_time: "00:05:30",
  first_camera_entry_time: "2024-01-01T10:00:00Z",
  final_camera_exit_time: "2024-01-01T10:05:30Z",
  camera_exit_body_time: "",
  camera_enter_body_timestamp: "",
  camera_exit_body_timestamp: "",
  osat_score: 85,
  createdAt: "2024-01-01T09:00:00Z",
}

export default function ViewAnnotation() {
  return (
    <>
      <SiteHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "View Annotation" },
        ]}
      />

      <div className="w-full flex-1 space-y-4 p-6">
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[65%_35%]">
          {/* Video Player Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-full">
                <VideoPlayer />
              </div>
            </div>
            {/* Timeline below video */}
            <AnnotationTimeline
              annotations={sampleAnnotations}
              videoDuration={330} // 5:30 in seconds
            />
          </div>

          <Card className="h-full">
            <CardContent>
              <Tabs defaultValue="video_details" className="w-full">
                <TabsList className="inline-flex h-10 w-max min-w-full items-center justify-start rounded-md bg-muted p-1 text-muted-foreground">
                  <TabsTrigger value="video_details">Video Details</TabsTrigger>
                  <TabsTrigger value="annotations">Annotations</TabsTrigger>
                </TabsList>

                <TabsContent
                  key="video_details"
                  value="video_details"
                  className="space-y-4"
                >
                  <VideoDetails video={mockVideo} />
                </TabsContent>
                <TabsContent key="annotations" value="annotations">
                  <AnnotationDetails
                    annotations={sampleAnnotations}
                    isViewMode={true}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
