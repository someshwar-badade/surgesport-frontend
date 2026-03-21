import { TableHeader, TableRow, TableHead } from "~/components/ui/table"

export function AnnotationTableHeader({ category }: any) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">#</TableHead>

        {/* {category !== "phases" && <TableHead>Time</TableHead>} */}

        {category === "phases" && (
          <>
            <TableHead>Phase</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead>Duration</TableHead>
          </>
        )}

        {category === "events" && 
        <><TableHead>Event</TableHead><TableHead>Time</TableHead></>}

        {category === "bleeds" && (
          <>
          <TableHead>Time</TableHead>
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

        {category === "anomaly" && <><TableHead>Time</TableHead><TableHead>Description</TableHead></>}

        {/* <TableHead>Created</TableHead> */}
      </TableRow>
    </TableHeader>
  )
}