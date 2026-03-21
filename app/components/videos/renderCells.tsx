import { TableCell } from "~/components/ui/table"
import { formatSeconds } from "~/lib/utils"

export const renderCells = (annotation: any, category: string) => {
  switch (category) {
    case "phases":
      return (
        <>
          <TableCell className="text-xs">
            {annotation.phaseName}
          </TableCell>
          <TableCell className="font-mono text-xs">
            {formatSeconds(annotation.time)}
          </TableCell>
          <TableCell className="font-mono text-xs">
            {annotation.endTime ? formatSeconds(annotation.endTime) : "-"}
          </TableCell>
          <TableCell className="font-mono text-xs">
            {annotation.endTime && annotation.time ? formatSeconds(annotation.endTime - annotation.time) : "-"}
          </TableCell>
        </>
      )

    case "events":
      return (
        <>
          <TableCell className="text-xs">
            {annotation.eventName}
          </TableCell>
          <TableCell className="font-mono text-xs">
            {formatSeconds(annotation.time)}
          </TableCell>
        </>
      )

    case "bleeds":
      return (
        <>
          <TableCell className="font-mono text-xs">
            {formatSeconds(annotation.time)}
          </TableCell>
          <TableCell className="text-xs capitalize">
            {annotation.severity}
          </TableCell>
          <TableCell className="font-mono text-xs">
            ({annotation.xPercent.toFixed(1)}%,{" "}
            {annotation.yPercent.toFixed(1)}%)
          </TableCell>
        </>
      )

    case "instrumentation":
      return (
        <>
          <TableCell className="text-xs">
            {annotation.instrumentName}
          </TableCell>
          <TableCell className="text-xs">
            {annotation.position}
          </TableCell>
          <TableCell className="font-mono text-xs">
            {formatSeconds(annotation.time)}
          </TableCell>
          <TableCell className="font-mono text-xs">
            {annotation.endTime ? formatSeconds(annotation.endTime) : "-"}
          </TableCell>
          <TableCell className="font-mono text-xs">
            {annotation.endTime && annotation.time ? formatSeconds(annotation.endTime - annotation.time) : "-"}
          </TableCell>
        </>
      )

    case "anomaly":
      return (
        <>
          <TableCell className="font-mono text-xs">
            {formatSeconds(annotation.time)}
          </TableCell>
          <TableCell className="max-w-32 truncate text-xs">
            {annotation.description}
          </TableCell>
        </>
      )

    default:
      return null
  }
}