"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Button } from "~/components/ui/button"
import { Switch } from "~/components/ui/switch"
import { Label } from "~/components/ui/label"
import { createProcedure, updateProcedure } from "~/lib/procedureService"

export default function ProcedureForm({
  open,
  setOpen,
  data,
  onSuccess,
}: any) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    is_active: true,
  })
const [errors, setErrors] = useState<any>({})
const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (data) {
      setForm(data)
    } else {
      setForm({
        name: "",
        slug: "",
        description: "",
        is_active: true,
      })
    }
  }, [data])

  const handleSubmit = async () => {
  if (!validate()) return

  try {
    setLoading(true)

    if (data) {
      await updateProcedure(data.id, form)
    } else {
      await createProcedure(form)
    }

    setOpen(false)
    onSuccess()
    setErrors({})
  } catch (error: any) {
    console.error(error)

    // Laravel validation errors
    if (error.response?.data?.errors) {
      setErrors(error.response.data.errors)
    } else {
      alert(error.message || "Something went wrong")
    }
  } finally {
    setLoading(false)
  }
}

const validate = () => {
  const newErrors: any = {}

  if (!form.name) newErrors.name = "Name is required"
  if (!form.slug) newErrors.slug = "Slug is required"

  setErrors(newErrors)

  return Object.keys(newErrors).length === 0
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {data ? "Edit Procedure" : "Create Procedure"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
                value={form.name}
                onChange={(e) => {
                    const name = e.target.value

                    // generate slug
                    const slug = name
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-")

                    setForm({ ...form, name, slug })

                    // clear error
                    setErrors((prev: any) => ({ ...prev, name: null }))
                }}
                />
                {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
                )}
          </div>

          <div>
            <Label>Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) =>
                setForm({ ...form, slug: e.target.value })
              }
            />
            {errors.slug && (
            <p className="text-sm text-red-500">{errors.slug}</p>
            )}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={form.is_active}
              onCheckedChange={(val) =>
                setForm({ ...form, is_active: val })
              }
            />
            <Label>Active</Label>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
            >
            {loading
                ? "Saving..."
                : data
                ? "Update"
                : "Create"}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}