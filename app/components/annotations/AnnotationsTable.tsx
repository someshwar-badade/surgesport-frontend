import * as React from "react"
import { createAnnotation, type Video } from "~/lib/annotationService"
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
import { Pencil, Trash ,Play } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"

interface VideoTableProps {
  readonly videos: Video[]
  readonly onView?: (id: string) => void
  readonly onEdit?: (id: string) => void
  readonly onDelete?: (id: string) => void
}

const PAGE_SIZE = 5

export function AnnotationsTable({
  videos,
  onView,
  onEdit,
  onDelete,
}: VideoTableProps) {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
const [selectedVideo, setSelectedVideo] = useState<any>(null)
const [open, setOpen] = useState(false)
const [loading, setLoading] = useState(false)
  const safeVideos = React.useMemo(() => (Array.isArray(videos) ? videos : []), [videos])

  const filtered = React.useMemo(() => {
    return safeVideos.filter(
      (v) =>
        (v.title?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (v.procedure?.name?.toLowerCase().includes(search.toLowerCase()) ?? false)
    )
  }, [search, safeVideos])

  const paged = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1

  const handleEdit = (annotationId: number) => {
     window.location.href = `/video/annotations/${annotationId}`
  }
  const handleCreateAnnotation = async () => {
        if (!selectedVideo) return

        try {
            setLoading(true)

        const data = await createAnnotation(selectedVideo.id)


            // ✅ close dialog
            setOpen(false)

            // ✅ redirect to annotation page
            window.location.href = `/video/annotations/${data.id}`

        } catch (err: any) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

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
            <TableHead>Video</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((v) => (
            <TableRow key={v.id}>
              <TableCell>
                {v.title || "N/A"}
               

                 
              </TableCell>
              <TableCell>{v.procedure?.name || "N/A"}</TableCell>
              <TableCell>{v.total_video_time_formatted ? `${v.total_video_time_formatted}` : "N/A"}</TableCell>
              <TableCell>
                {v.video_url ? (
                    <a
                        href={v.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800"
                    >
                        <Play className="w-4 h-4" />
                    </a>
                    ) : "N/A"}
              </TableCell>
              <TableCell>
                {v.created_at ? new Date(v.created_at).toLocaleDateString() : "N/A"}
              </TableCell>
              
              <TableCell>
                <div className="flex gap-2">
                    {v.annotations && v.annotations.id ? (
                      <Button size="sm" onClick={() => handleEdit(v.annotations.id)}>
                        Edit Annotations
                      </Button>
                    ) : (
                      <Button
                            size="sm"
                            onClick={() => {
                                setSelectedVideo(v)
                                setOpen(true)
                            }}
                            >
                            Create Annotations
                            </Button>
                    )}
                  </div>
                  
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>Create Annotation</DialogTitle>
    </DialogHeader>

    {selectedVideo && (
      <div className="space-y-3 text-sm">
        <p><strong>Title:</strong> {selectedVideo.title}</p>
        <p><strong>Procedure:</strong> {selectedVideo.procedure_type}</p>
        <p><strong>Created By:</strong> {selectedVideo.created_by}</p>

        <video
          src={selectedVideo.video_url}
          controls
          className="w-full rounded-lg"
        />
      </div>
    )}

    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>

      <Button onClick={handleCreateAnnotation} disabled={loading}>
        {loading ? "Creating..." : "Confirm"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

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
