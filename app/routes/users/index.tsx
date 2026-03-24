import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { SiteHeader } from "~/components/site-header"
import { Button } from "~/components/ui/button"
import { useToast } from "~/components/ui/toast"
import { UserTable } from "~/components/users/UserTable"
import { deleteUser, getUsers } from "~/lib/userService"
import type { User } from "~/types/auth.type"

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    })
  }, [])

  const handleDelete = async (id: number) => {
  await deleteUser(id);

  setUsers((u) => u.filter((x) => x.id !== id))

  toast.addToast({
    title: "Deleted",
    description: "User was removed",
    variant: "success",
  })
}

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <SiteHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Users" },
        ]}
      />
      <div className="w-full flex-1 p-6">
        <div className="mb-4 flex items-center justify-end">
          <Button
            asChild
            className="rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            <Link to="/users/create">+ Create User</Link>
          </Button>
        </div>
        <UserTable
          users={users}
          onView={(id) => navigate(`/users/${id}`)}
          onEdit={(id) => navigate(`/users/${id}/edit`)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
