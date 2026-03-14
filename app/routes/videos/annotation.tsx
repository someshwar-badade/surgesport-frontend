import { useState } from "react"
import { SiteHeader } from "~/components/site-header"
import VideoPlayer from "~/components/video-player"
import { VideoDetails } from "~/components/videos/VideoDetails"
import { AnnotationDetails } from "~/components/videos/AnnotationDetails"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Card, CardContent } from "~/components/ui/card"

export default function Annotation() {
  const [capture, setCapture] = useState<any>(null)

  // Mock video data - in a real app, this would come from props or state
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
                          >  <VideoDetails video={mockVideo} /></TabsContent>
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
