import { useState } from "react"
import { SiteHeader } from "~/components/site-header"
import VideoPlayer from "~/components/video-player"
import { VideoDetails } from "~/components/videos/VideoDetails"
import { AnnotationDetails } from "~/components/videos/AnnotationDetails"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Card, CardContent } from "~/components/ui/card"
import { NavLink } from "react-router"

export default function Annotation() {
  const [capture, setCapture] = useState<any>(null)

  // Mock video data - updated to match new Video interface
  const mockVideo = {
    id: "1",
    procedure_type: "Endoscopy",
    title: "Sample Endoscopy Video",
    total_video_time: "00:05:05", // 5.5 minutes in seconds
    video_url: "https://example.com/sample-video.mp4",
    created_at: "2024-01-01T09:00:00Z",
    updated_at: "2024-01-01T09:00:00Z",
  }

  const handleSaveAnnotation = (annotation: any) => {
    console.log("Saving annotation:", annotation)
    // Here you would typically save to a backend or state management
  }

  const handleClearCapture = () => {
    setCapture(null)
  }

  return (
    <>
      <SiteHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Annotation" },
        ]}
      />

      <div className="w-full flex-1 p-6">
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[65%_35%]">
          {/* Video Player Column */}
          <div className="flex items-center justify-center">
            <div className="w-full">
              <NavLink to="/videos/annotation/view" className="text-blue-500 hover:underline">
                    Go to annotation timeline
                  </NavLink>
              <VideoPlayer onCapture={setCapture} />
            </div>
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
                  {" "}
                  <VideoDetails video={mockVideo} />
                </TabsContent>
                <TabsContent key="annotations" value="annotations">
                  <AnnotationDetails
                    capture={capture}
                    onSaveAnnotation={handleSaveAnnotation}
                    onClearCapture={handleClearCapture}
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
