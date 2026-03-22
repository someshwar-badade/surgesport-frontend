import { Button } from "~/components/ui/button"
import { Switch } from "~/components/ui/switch"
import { Pencil, Trash } from "lucide-react"

export const columns = ({ onEdit, onDelete }: any) => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }: any) => (
      <Switch checked={row.original.is_active} disabled />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(row.original)}>
          <Pencil className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(row.original.id)}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
]