import { useNavigate } from "react-router"
import { SiteHeader } from "~/components/site-header"
import { useToast } from "~/components/ui/toast"
import { UserForm } from "~/components/users/UserForm"
import { createUser } from "~/lib/userService"
import type { RegisterData } from "~/types/auth.type"


export default function CreateUser() {
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (data: RegisterData) => {
   try {
    const res = await createUser(data);
    toast.addToast({
      title: "Created",
      description: "User added successfully",
      variant: "success",
    })
    navigate("/users/all")
   } catch (error) {
    toast.addToast({
      title: "Failed",
      description: "error "+ error ,
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
          { label: "Create user" },
        ]}
      />
      <div className="w-full flex-1 p-6">
        <UserForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/users/all")}
        />
      </div>
    </div>
  )
}
