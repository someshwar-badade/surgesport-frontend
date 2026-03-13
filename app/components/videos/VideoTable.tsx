import * as React from "react"
import type { Video } from "~/lib/videoService"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "~/components/ui/table"

interface VideoTableProps {
  readonly videos: Video[]
  readonly onView?: (id: string) => void
  readonly onEdit?: (id: string) => void
  readonly onDelete?: (id: string) => void
}

const PAGE_SIZE = 5

export function VideoTable({
  videos,
  onView,
  onEdit,
  onDelete,
}: VideoTableProps) {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)

  const filtered = React.useMemo(() => {
    return videos.filter(
      (v) =>
        v.video_id.toLowerCase().includes(search.toLowerCase()) ||
        v.procedure_type.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, videos])

  const paged = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-1/3 rounded border px-2 py-1"
        />
        <div className="text-sm text-gray-600">
          Page {page} / {totalPages}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Video ID</TableHead>
            <TableHead>Procedure</TableHead>
            <TableHead>Total Time</TableHead>
            <TableHead>OSAT</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((v) => (
            <TableRow key={v.id}>
              <TableCell>{v.video_id}</TableCell>
              <TableCell>{v.procedure_type}</TableCell>
              <TableCell>{v.total_video_time}</TableCell>
              <TableCell>{v.osat_score}</TableCell>
              <TableCell>
                {new Date(v.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {onView && (
                    <button
                      onClick={() => onView(v.id)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(v.id)}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(v.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
