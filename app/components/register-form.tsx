import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import React, { useState, useEffect } from "react"
import useAuthActions from "~/hooks/useAuthActions"
import { useNavigate } from "react-router"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import type { RegisterData } from "~/types/auth.type"
import apiClient from "~/api/apiClient"

type Role = {
  id: string
  name: string
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { error, userRegister, loading } = useAuthActions()
  const navigate = useNavigate()
  const [roles, setRoles] = useState<Role[]>([])
  const [form, setForm] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  })

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await apiClient.get("/roles")
        const roleData = res.data.data || []
        setRoles(roleData)

        // Set default role if available and not already set
        if (roleData.length > 0 && !form.role) {
          setForm(prev => ({
            ...prev,
            role: roleData[0].id.toString(),
          }))
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error)
      }
    }

    fetchRoles()
  }, []) // Empty dependency array - only runs on mount

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Optional: Add password confirmation validation
    if (form.password !== form.password_confirmation) {
      // Handle password mismatch error
      console.error("Passwords do not match")
      return
    }

    const res = await userRegister(form)

    if (res) {
      navigate("/login")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create an Account</h1>
                <p className="text-balance text-muted-foreground">
                  Sign up to get started
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  disabled={loading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value })
                  }}
                  required
                  disabled={loading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password_confirmation">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="password_confirmation"
                  type="password"
                  placeholder="********"
                  value={form.password_confirmation}
                  onChange={(e) => {
                    setForm({ ...form, password_confirmation: e.target.value })
                  }}
                  required
                  disabled={loading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="role">Role</FieldLabel>
                <Select
                  value={form.role}
                  onValueChange={(value) =>
                    setForm({ ...form, role: value })
                  }
                  disabled={loading || roles.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </Field>

              {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
              )}

              <FieldDescription className="text-center">
                Already have an account? <a href="/login">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}