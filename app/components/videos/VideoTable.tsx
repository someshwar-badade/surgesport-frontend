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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"

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

  const safeVideos = React.useMemo(() => (Array.isArray(videos) ? videos : []), [videos])

  const filtered = React.useMemo(() => {
    return safeVideos.filter(
      (v) =>
        (v.title?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (v.procedure_type?.toLowerCase().includes(search.toLowerCase()) ?? false)
    )
  }, [search, safeVideos])

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
            <TableHead>Title</TableHead>
            <TableHead>Procedure</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Video URL</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((v) => (
            <TableRow key={v.id}>
              <TableCell>{v.title || "N/A"}</TableCell>
              <TableCell>{v.procedure_type || "N/A"}</TableCell>
              <TableCell>{v.total_video_time_formatted ? `${v.total_video_time_formatted}` : "N/A"}</TableCell>
              <TableCell>
                {v.video_url ? (
                  <a
                    href={v.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Video
                  </a>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>
                {v.created_at ? new Date(v.created_at).toLocaleDateString() : "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {/* {onView && (
                    <button
                      onClick={() => onView(v.id)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  )} */}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(v.id)}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <AlertDialog>
  <AlertDialogTrigger asChild>
    <button className="text-red-500">Delete</button>
  </AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete the video.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>

      <AlertDialogAction
        onClick={() => onDelete(v.id)}
        className="bg-red-600 hover:bg-red-700"
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
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
