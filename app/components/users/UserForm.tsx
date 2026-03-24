import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Field } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import apiClient from "~/api/apiClient"
import type { RegisterData, User } from "~/types/auth.type"

type Role = {
  id: string
  name: string
}

interface UserFormProps {
  readonly initialData?: Partial<User>
  readonly onSubmit: (data: RegisterData) => void
  readonly onCancel?: () => void
}

export function UserForm({
  initialData = {},
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [loading, setLoading] = React.useState(true)

  const [form, setForm] = React.useState({
    name: initialData.name || "",
    email: initialData.email || "",
    password: "",
    password_confirmation: "",
    role: initialData.role_id?.toString() || "",
  })

  const [roles, setRoles] = React.useState<Role[]>([])
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // 🔹 Fetch roles
  React.useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await apiClient.get("/roles")
        const roleData = res.data.data || []

        setRoles(roleData)

        if (!form.role && roleData.length > 0) {
          setForm(prev => ({
            ...prev,
            role: roleData[0].id.toString(),
          }))
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [])

  // 🔹 Handle input change
  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // 🔹 Validation
  const validate = () => {
    const errs: Record<string, string> = {}

    if (!form.name) errs.name = "Name is required"
    if (!form.email) {
      errs.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Invalid email"
    }

    if (!form.role) errs.role = "Role is required"

      if (!initialData && !form.password) errs.password = "Password is required"
      if (!initialData && form.password.length < 6)
        errs.password = "Minimum 6 characters required"

      if (!initialData && form.password !== form.password_confirmation) {
        errs.password_confirmation = "Passwords do not match"
      }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // 🔹 Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      name: form.name,
      email: form.email,
      role: form.role,
      password: form.password,
      password_confirmation: form.password_confirmation,
    })
  }

  if (loading) {
    return <div className="text-center p-6">Loading roles...</div>
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Name */}
            <Field>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter name"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </Field>

            {/* Email */}
            <Field>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter email"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </Field>

            {/* Role */}
            <Field>
              <label className="text-sm font-medium">Role</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
            </Field>

            {/* Password */}
            <Field>
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </Field>

            {/* Confirm Password */}
            <Field>
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                value={form.password_confirmation}
                onChange={(e) =>
                  handleChange("password_confirmation", e.target.value)
                }
              />
              {errors.password_confirmation && (
                <p className="text-xs text-red-500">
                  {errors.password_confirmation}
                </p>
              )}
            </Field>

          </div>

          <div className="flex justify-end gap-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}