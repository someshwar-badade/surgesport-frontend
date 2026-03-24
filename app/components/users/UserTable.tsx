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
import { Pencil, Trash } from "lucide-react"
import { Button } from "../ui/button"
import type { UserWithRole } from "~/types/auth.type"
import { useMemo, useState } from "react"

interface UserTableProps {
  readonly users: UserWithRole[]
  readonly onView?: (id: number) => void
  readonly onEdit?: (id: number) => void
  readonly onDelete?: (id: number) => void
}

const PAGE_SIZE = 5

export function UserTable({
  users,
  onView,
  onEdit,
  onDelete,
}: UserTableProps) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

    const safeUsers = useMemo(() => (Array.isArray(users) ? users : []), [users])
  
  const filtered = useMemo(() => {
    return safeUsers.filter(
      (u) =>
        (u.name?.toLowerCase().includes(search.toLowerCase()) ?? false)
    )
  }, [search, safeUsers])

  const paged = useMemo(() => {
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
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.name || "N/A"}</TableCell>
              <TableCell>{u.email || "N/A"}</TableCell>
              <TableCell>{u.role?.display_name || "N/A"}</TableCell>
              <TableCell>
                {u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"}
              </TableCell>
              
              <TableCell>
                <div className="flex gap-2">
                  {onEdit && (
                    <Button  size="sm"
          variant="outline"
                      onClick={() => onEdit(u.id)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="sm"
                            variant="destructive"  ><Trash className="w-4 h-4" /></Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user.
                        </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction
                            onClick={() => onDelete(u.id)}
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
