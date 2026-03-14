import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

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
  category: "phases" | "events" | "bleeds" | "instrumentation" | "anomaly"
  // Phase specific fields
  phaseName?: string
  endTime?: number
  duration?: number
  // Event specific fields
  eventName?: string
  // Bleed specific fields
  interventionTime?: number
  severity?: "mild" | "moderate" | "severe"
  // Instrumentation specific fields
  instrumentName?: string
  position?: "Left" | "Center" | "Right"
  // Anomaly specific fields
  description?: string
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
  // Form state for additional fields
  const [phaseName, setPhaseName] = React.useState("")
  const [eventName, setEventName] = React.useState("")
  const [severity, setSeverity] = React.useState<"mild" | "moderate" | "severe">("mild")
  const [instrumentName, setInstrumentName] = React.useState("")
  const [position, setPosition] = React.useState<"Left" | "Center" | "Right">("Center")
  const [description, setDescription] = React.useState("")
  // Phase tracking state
  const [activePhases, setActivePhases] = React.useState<{[key: string]: {startTime: number, startAnnotation: Annotation}}>({})
  const [activeInstruments, setActiveInstruments] = React.useState<{[key: string]: {startTime: number, startAnnotation: Annotation}}>({})

  const handleSaveAnnotation = (category: Annotation["category"]) => {
    if (!capture) return

    const baseAnnotation = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...capture,
      category,
    }

    let annotation: Annotation

    if (category === "phases") {
      // Check if this phase is already active
      if (activePhases[phaseName]) {
        // End the phase by updating the existing start annotation
        const startData = activePhases[phaseName]
        const endTime = capture.time
        const duration = endTime - startData.startTime

        setAnnotations((prev) =>
          prev.map((ann) =>
            ann.id === startData.startAnnotation.id
              ? { ...ann, endTime, duration }
              : ann
          )
        )

        // Remove from active phases
        setActivePhases((prev) => {
          const newActive = { ...prev }
          delete newActive[phaseName]
          return newActive
        })

        return
      }

      // Start a new phase
      annotation = {
        ...baseAnnotation,
        phaseName,
        note: `${phaseName} phase started at ${capture.time.toFixed(2)}s`,
      }

      // Add to active phases
      setActivePhases((prev) => ({
        ...prev,
        [phaseName]: {
          startTime: capture.time,
          startAnnotation: annotation,
        },
      }))
    } else {
      // Handle other categories normally
      switch (category) {
        case "events":
          annotation = {
            ...baseAnnotation,
            eventName,
            note: `${eventName} event at ${capture.time.toFixed(2)}s`,
          }
          break
        case "bleeds":
          annotation = {
            ...baseAnnotation,
            severity,
            note: `${severity} bleed at ${capture.time.toFixed(2)}s`,
          }
          break
        case "instrumentation":
          // If this instrument is already active, end it and calculate duration
          if (activeInstruments[instrumentName]) {
            const startData = activeInstruments[instrumentName]
            const endTime = capture.time
            const duration = endTime - startData.startTime

            setAnnotations((prev) =>
              prev.map((ann) =>
                ann.id === startData.startAnnotation.id
                  ? { ...ann, endTime, duration }
                  : ann
              )
            )

            setActiveInstruments((prev) => {
              const newActive = { ...prev }
              delete newActive[instrumentName]
              return newActive
            })

            return
          }

          // Start a new instrumentation entry
          annotation = {
            ...baseAnnotation,
            instrumentName,
            position,
            note: `${instrumentName} (${position}) started at ${capture.time.toFixed(2)}s`,
          }

          setActiveInstruments((prev) => ({
            ...prev,
            [instrumentName]: {
              startTime: capture.time,
              startAnnotation: annotation,
            },
          }))
          break
        case "anomaly":
          annotation = {
            ...baseAnnotation,
            description,
            note: `Anomaly: ${description} at ${capture.time.toFixed(2)}s`,
          }
          break
        default:
          annotation = {
            ...baseAnnotation,
            note: `Annotation at ${capture.time.toFixed(2)}s`,
          }
      }
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
      anomaly: "Anomaly",
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
      anomaly: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    }
    return colors[category]
  }

  const getSaveButtonLabel = (category: Annotation["category"]) => {
    if (category === "phases") {
      return activePhases[phaseName] ? "End Phase" : "Start Phase"
    }

    if (category === "instrumentation") {
      return activeInstruments[instrumentName]
        ? "End Instrument"
        : "Start Instrument"
    }

    return `Save ${getCategoryLabel(category)} Annotation`
  }


  return (
    <Card className="h-full">
      
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
              <TabsTrigger value="anomaly" className="whitespace-nowrap">
                Anomaly ({getAnnotationsByCategory("anomaly").length})
              </TabsTrigger>
            </TabsList>
          </div>

          {(["phases", "events", "bleeds", "instrumentation", "anomaly"] as const).map(
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

                    {/* Category-specific form fields */}
                    <div className="space-y-3">
                      {category === "phases" && (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="phaseName" className="text-sm font-medium">
                              Phase Name
                            </Label>
                            <select
                              id="phaseName"
                              value={phaseName}
                              onChange={(e) => setPhaseName(e.target.value)}
                              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="">Select Phase</option>
                              <option value="Retraction">Retraction</option>
                              <option value="Lysis of Adhesions">Lysis of Adhesions</option>
                              <option value="Dissection of Cystic Triangle">Dissection of Cystic Triangle</option>
                              <option value="Clipping Phase">Clipping Phase</option>
                              <option value="Individual Clip Applications">Individual Clip Applications</option>
                              <option value="Dissection of Gallbladder from Liver Bed">Dissection of Gallbladder from Liver Bed</option>
                            </select>
                          </div>

                          {/* Show active phases */}
                          {Object.keys(activePhases).length > 0 && (
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                                Active Phases
                              </h4>
                              <div className="space-y-1">
                                {Object.entries(activePhases).map(([phase, data]) => (
                                  <div key={phase} className="text-xs text-yellow-700 dark:text-yellow-300">
                                    {phase}: Started at {data.startTime.toFixed(2)}s
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {category === "events" && (
                        <div>
                          <Label htmlFor="eventName" className="text-sm font-medium">
                            Event Name
                          </Label>
                          <select
                            id="eventName"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="">Select Event</option>
                            <option value="CCVS I">CCVS I</option>
                            <option value="CCVS II">CCVS II</option>
                            <option value="CCVS III">CCVS III</option>
                            <option value="Cystic Artery Cut">Cystic Artery Cut</option>
                            <option value="Cystic Duct Cut">Cystic Duct Cut</option>
                            <option value="Clip Applied">Clip Applied</option>
                          </select>
                        </div>
                      )}

                      {category === "bleeds" && (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="severity" className="text-sm font-medium">
                              Severity
                            </Label>
                            <select
                              id="severity"
                              value={severity}
                              onChange={(e) => setSeverity(e.target.value as "mild" | "moderate" | "severe")}
                              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="mild">Mild</option>
                              <option value="moderate">Moderate</option>
                              <option value="severe">Severe</option>
                            </select>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Location: ({capture.xPercent.toFixed(1)}%, {capture.yPercent.toFixed(1)}%)</p>
                          </div>
                        </div>
                      )}

                      {category === "instrumentation" && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="instrumentName" className="text-sm font-medium">
                                Instrument
                              </Label>
                              <select
                                id="instrumentName"
                                value={instrumentName}
                                onChange={(e) => setInstrumentName(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                <option value="">Select Instrument</option>
                                <option value="camera">Camera</option>
                                <option value="grasper">Grasper</option>
                                <option value="dissector">Dissector</option>
                                <option value="clip applier">Clip Applier</option>
                                <option value="suction">Suction</option>
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="position" className="text-sm font-medium">
                                Position
                              </Label>
                              <select
                                id="position"
                                value={position}
                                onChange={(e) => setPosition(e.target.value as "Left" | "Center" | "Right")}
                                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                <option value="Left">Left</option>
                                <option value="Center">Center</option>
                                <option value="Right">Right</option>
                              </select>
                            </div>
                          </div>

                          {/* Show active instruments */}
                          {Object.keys(activeInstruments).length > 0 && (
                            <div className="p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg border border-teal-200 dark:border-teal-800">
                              <h4 className="text-sm font-medium text-teal-800 dark:text-teal-200 mb-2">
                                Active Instruments
                              </h4>
                              <div className="space-y-1 text-xs text-teal-700 dark:text-teal-300">
                                {Object.entries(activeInstruments).map(([instrument, data]) => (
                                  <div key={instrument}>
                                    {instrument}: Started at {data.startTime.toFixed(2)}s
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {category === "anomaly" && (
                        <div>
                          <Label htmlFor="description" className="text-sm font-medium">
                            Description
                          </Label>
                          <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the anomaly..."
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSaveAnnotation(category)}
                        size="sm"
                        disabled={
                          (category === "phases" && !phaseName) ||
                          (category === "instrumentation" && !instrumentName)
                        }
                      >
                        {getSaveButtonLabel(category)}
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
                            {category !== "phases" && <TableHead>Time</TableHead>}
                            {category === "phases" && (
                              <>
                                <TableHead>Phase</TableHead>
                                <TableHead>Start</TableHead>
                                <TableHead>End</TableHead>
                                <TableHead>Duration</TableHead>
                              </>
                            )}
                            {category === "events" && <TableHead>Event</TableHead>}
                            {category === "bleeds" && (
                              <>
                                <TableHead>Severity</TableHead>
                                <TableHead>Location</TableHead>
                              </>
                            )}
                            {category === "instrumentation" && (
                              <>
                                <TableHead>Instrument</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Start</TableHead>
                                <TableHead>End</TableHead>
                                <TableHead>Duration</TableHead>
                              </>
                            )}
                            {category === "anomaly" && <TableHead>Description</TableHead>}
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
                                {category !== "phases" && (
                                  <TableCell className="font-mono text-xs">
                                    {annotation.time.toFixed(2)}s
                                  </TableCell>
                                )}
                                {category === "phases" && (
                                  <>
                                    <TableCell className="text-xs">
                                      {annotation.phaseName}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                      {annotation.time.toFixed(2)}s
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                      {annotation.endTime ? `${annotation.endTime.toFixed(2)}s` : '-'}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                      {annotation.duration ? `${annotation.duration.toFixed(2)}s` : '-'}
                                    </TableCell>
                                  </>
                                )}
                                {category === "events" && (
                                  <TableCell className="text-xs">
                                    {annotation.eventName}
                                  </TableCell>
                                )}
                                {category === "bleeds" && (
                                  <>
                                    <TableCell className="text-xs capitalize">
                                      {annotation.severity}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                      ({annotation.xPercent.toFixed(1)}%,{" "}
                                      {annotation.yPercent.toFixed(1)}%)
                                    </TableCell>
                                  </>
                                )}
                                {category === "instrumentation" && (
                                  <>
                                    <TableCell className="text-xs">
                                      {annotation.instrumentName}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                      {annotation.position}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                      {annotation.time.toFixed(2)}s
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                      {annotation.endTime ? `${annotation.endTime.toFixed(2)}s` : '-'}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                      {annotation.duration ? `${annotation.duration.toFixed(2)}s` : '-'}
                                    </TableCell>
                                  </>
                                )}
                                {category === "anomaly" && (
                                  <TableCell className="text-xs max-w-32 truncate">
                                    {annotation.description}
                                  </TableCell>
                                )}
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
