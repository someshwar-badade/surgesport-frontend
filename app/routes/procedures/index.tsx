"use client"

import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { DataTable } from "~/components/ui/data-table"
import { columns } from "./columns"
import ProcedureForm from "./procedure-form"
import { Plus } from "lucide-react"
import { deleteProcedure, getProcedures } from "~/lib/procedureService"
import type { Procedure } from "~/types/procedure.type"
import { SiteHeader } from "~/components/site-header"

export default function ProceduresPage() {
  const [data, setData] = useState<Procedure[]>([])
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)

  const fetchData = async () => {
    try {
    const data = await getProcedures()
    setData(data)
  } catch (err) {
    console.error(err)
  }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
    <SiteHeader breadcrumbs={[{ label: "Dashboard", href: "/dashboard" },{ label: "Procedures" }]} />
            <div className="w-full flex-1 p-6">
                <div className="mb-4 flex items-center justify-end">
                <Button onClick={() => {
                                setSelected(null)
                                setOpen(true)
                                }}
                    
                    className="rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                                Add Procedure
                </Button>
                </div>

                   
                           

                                <DataTable
                                    columns={columns({
                                    onEdit: (row: any) => {
                                        setSelected(row)
                                        setOpen(true)
                                    },
                                    onDelete: async (id: number) => {
                                        await deleteProcedure(id)
                                        fetchData()
                                    },
                                    })}
                                    data={data}
                                />

                                <ProcedureForm
                                    open={open}
                                    setOpen={setOpen}
                                    data={selected}
                                    onSuccess={fetchData}
                                />
                       
            </div>
            </>
  )
}