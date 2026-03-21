import { TableRow, TableCell } from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import { renderCells } from "./renderCells"
import { getCategoryColor } from "~/utils/getCategoryColor"

export function AnnotationTableRow({
  annotation,
  index,
  category,
  onClick,
}: any) {
  return (
    <TableRow
      onClick={() => onClick?.(annotation.time)}
      className="cursor-pointer hover:bg-muted/50"
    >
      {/* Index */}
      <TableCell>
        <Badge variant="secondary" className={getCategoryColor(category)}>
          {index + 1}
        </Badge>
      </TableCell>

      {/* Dynamic cells */}
      {renderCells(annotation, category)}

      {/* Created */}
      {/* <TableCell className="text-xs text-muted-foreground">
        {new Date(annotation.timestamp).toLocaleTimeString()}
      </TableCell> */}
    </TableRow>
  )
}