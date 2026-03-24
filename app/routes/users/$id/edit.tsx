import React from "react"
import { useNavigate, useParams } from "react-router"
import { SiteHeader } from "~/components/site-header"
import { useToast } from "~/components/ui/toast"
import { UserForm } from "~/components/users/UserForm"
import { getUserById, updateUser } from "~/lib/userService"
import type { RegisterData, User, UserUpdateData } from "~/types/auth.type"

export default function EditUser() {
  const { id } = useParams()
  const [user, setUser] = React.useState<User | null>(null)
  const navigate = useNavigate()
  const toast = useToast()

  const toDateTimeLocal = (value?: string | Date) => {
    if (!value) return ""

    const date = new Date(value)

    // Fix timezone offset
    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - offset * 60000)

    return localDate.toISOString().slice(0, 16)
  }

  React.useEffect(() => {
    if (!id) return
    getUserById(Number(id)).then((u) => {
      if (u) {
        setUser(u);
      }
    })
  }, [id])

  if (!user) return <div>Loading...</div>

  const handleSubmit = async (data: RegisterData) => {
  try {
    await updateUser(user.id, data)
    toast.addToast({
      title: "Updated",
      description: "User updated",
      variant: "success",
    })
    navigate(`/users/${user.id}/edit`)
  } catch (error) {
     toast.addToast({
      title: "Failure",
      description: "User not updated",
      variant: "error",
    })
  }
    
  }

  return (
    <div>
          <SiteHeader
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Users", href: "/users/all" },
              { label: "Edit User" },
            ]}
          />
          <div className="w-full flex-1 p-6">
      
          <UserForm
            initialData={user}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/users/${user.id}`)}
          />
      </div>
    </div>
  )
}
