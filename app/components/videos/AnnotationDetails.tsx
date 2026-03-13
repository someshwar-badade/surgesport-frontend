import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

type CaptureData = {
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
}

interface AnnotationDetailsProps {
  readonly capture: CaptureData | null
  readonly onSaveAnnotation?: (annotation: any) => void
  readonly onClearCapture?: () => void
}

export function AnnotationDetails({
  capture,
  onSaveAnnotation,
  onClearCapture,
}: AnnotationDetailsProps) {
  const [annotations, setAnnotations] = React.useState<any[]>([])

  const handleSaveAnnotation = () => {
    if (!capture) return

    const annotation = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...capture,
      note: `Annotation at ${capture.time.toFixed(2)}s`,
    }

    setAnnotations((prev) => [...prev, annotation])
    onSaveAnnotation?.(annotation)
  }

  const handleClear = () => {
    onClearCapture?.()
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Annotation Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="capture" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="capture">Current Capture</TabsTrigger>
            <TabsTrigger value="annotations">
              Annotations {annotations.length > 0 && `(${annotations.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="capture" className="space-y-4">
            {capture ? (
              <div className="space-y-4">
                <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20">
                  <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-100">
                    Current Capture
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Time:</span>{" "}
                      {capture.time.toFixed(2)} sec
                    </div>
                    <div>
                      <span className="font-medium">X:</span>{" "}
                      {capture.x.toFixed(1)}px
                    </div>
                    <div>
                      <span className="font-medium">Y:</span>{" "}
                      {capture.y.toFixed(1)}px
                    </div>
                    <div>
                      <span className="font-medium">X%:</span>{" "}
                      {capture.xPercent.toFixed(2)}%
                    </div>
                    <div>
                      <span className="font-medium">Y%:</span>{" "}
                      {capture.yPercent.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveAnnotation} size="sm">
                    Save Annotation
                  </Button>
                  <Button onClick={handleClear} variant="outline" size="sm">
                    Clear
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>Click on the video to capture coordinates</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="annotations" className="space-y-4">
            {annotations.length > 0 ? (
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {annotations.map((annotation, index) => (
                  <div
                    key={annotation.id}
                    className="rounded border bg-gray-50 p-3 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(annotation.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <div>Time: {annotation.time.toFixed(2)}s</div>
                      <div>
                        Position: ({annotation.xPercent.toFixed(1)}%,{" "}
                        {annotation.yPercent.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No annotations saved yet</p>
                <p className="mt-1 text-xs">
                  Capture coordinates and save them as annotations
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
