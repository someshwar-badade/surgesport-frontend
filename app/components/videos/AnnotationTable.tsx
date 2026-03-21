import { Table, TableBody } from "~/components/ui/table"
import { AnnotationTableHeader } from "./AnnotationTableHeader"
import { AnnotationTableRow } from "./AnnotationTableRow"

export function AnnotationTable({
  category,
  annotations,
  onAnnotationClick,
}: any) {
  return (
    <div className="max-h-64 overflow-y-auto">
      <Table>
        <AnnotationTableHeader category={category} />

        <TableBody>
          {annotations.map((annotation: any, index: number) => (
            <AnnotationTableRow
              key={annotation.id}
              annotation={annotation}
              index={index}
              category={category}
              onClick={onAnnotationClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}