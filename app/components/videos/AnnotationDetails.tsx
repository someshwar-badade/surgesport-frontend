import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

type CaptureData = {
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
}

type Annotation = {
  id: string
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  category: "phases" | "events" | "bleeds" | "instrumentation"
  note?: string
}

interface AnnotationDetailsProps {
  readonly capture: CaptureData | null
  readonly onSaveAnnotation?: (annotation: Annotation) => void
  readonly onClearCapture?: () => void
}

export function AnnotationDetails({
  capture,
  onSaveAnnotation,
  onClearCapture,
}: AnnotationDetailsProps) {
  const [annotations, setAnnotations] = React.useState<Annotation[]>([])

  const handleSaveAnnotation = (category: Annotation["category"]) => {
    if (!capture) return

    const annotation: Annotation = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...capture,
      category,
      note: `${category.charAt(0).toUpperCase() + category.slice(1)} annotation at ${capture.time.toFixed(2)}s`,
    }

    setAnnotations((prev) => [...prev, annotation])
    onSaveAnnotation?.(annotation)
  }

  const handleClear = () => {
    onClearCapture?.()
  }

  const getAnnotationsByCategory = (category: Annotation["category"]) => {
    return annotations.filter((annotation) => annotation.category === category)
  }

  const getCategoryLabel = (category: Annotation["category"]) => {
    const labels = {
      phases: "Phases",
      events: "Events",
      bleeds: "Bleeds",
      instrumentation: "Instrumentation",
    }
    return labels[category]
  }

  const getCategoryColor = (category: Annotation["category"]) => {
    const colors = {
      phases: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      events:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      bleeds: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      instrumentation:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    }
    return colors[category]
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Annotation Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="phases" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex h-10 w-max min-w-full items-center justify-start rounded-md bg-muted p-1 text-muted-foreground">
              <TabsTrigger value="phases" className="whitespace-nowrap">
                Phases ({getAnnotationsByCategory("phases").length})
              </TabsTrigger>
              <TabsTrigger value="events" className="whitespace-nowrap">
                Events ({getAnnotationsByCategory("events").length})
              </TabsTrigger>
              <TabsTrigger value="bleeds" className="whitespace-nowrap">
                Bleeds ({getAnnotationsByCategory("bleeds").length})
              </TabsTrigger>
              <TabsTrigger value="instrumentation" className="whitespace-nowrap">
                Instrumentation ({getAnnotationsByCategory("instrumentation").length})
              </TabsTrigger>
            </TabsList>
          </div>

          {(["phases", "events", "bleeds", "instrumentation"] as const).map(
            (category) => (
              <TabsContent
                key={category}
                value={category}
                className="space-y-4"
              >
                {capture ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20">
                      <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-100">
                        Current Capture - {getCategoryLabel(category)}
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
                      <Button
                        onClick={() => handleSaveAnnotation(category)}
                        size="sm"
                      >
                        Save {getCategoryLabel(category)} Annotation
                      </Button>
                      <Button onClick={handleClear} variant="outline" size="sm">
                        Clear
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>Click on the video to capture coordinates</p>
                    <p className="mt-1 text-xs">
                      Then save as a {getCategoryLabel(category).toLowerCase()}{" "}
                      annotation
                    </p>
                  </div>
                )}

                {getAnnotationsByCategory(category).length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">
                      Saved {getCategoryLabel(category)} Annotations
                    </h3>
                    <div className="max-h-64 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Created</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getAnnotationsByCategory(category).map(
                            (annotation, index) => (
                              <TableRow key={annotation.id}>
                                <TableCell>
                                  <Badge
                                    variant="secondary"
                                    className={getCategoryColor(category)}
                                  >
                                    {index + 1}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                  {annotation.time.toFixed(2)}s
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                  ({annotation.xPercent.toFixed(1)}%,{" "}
                                  {annotation.yPercent.toFixed(1)}%)
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                  {new Date(annotation.timestamp).toLocaleTimeString()}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </TabsContent>
            )
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
