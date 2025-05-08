"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getData, updateData } from "@/lib/data-utils"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function EditDepartmentPage() {
  const params = useParams()
  const router = useRouter()
  const departmentId = params.id as string

  const [department, setDepartment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchDepartment() {
      try {
        const departments = await getData("departments")
        const foundDepartment = departments.find((dept: any) => dept.id === departmentId)

        if (foundDepartment) {
          setDepartment(foundDepartment)
        } else {
          toast({
            title: "Department not found",
            description: "The department you're trying to edit doesn't exist.",
            variant: "destructive",
          })
          router.push("/dashboard/instructor/departments")
        }
      } catch (error) {
        console.error("Error fetching department:", error)
        toast({
          title: "Error",
          description: "Failed to load department data.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartment()
  }, [departmentId, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDepartment((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const departments = await getData("departments")
      const updatedDepartments = departments.map((dept: any) => (dept.id === departmentId ? department : dept))

      await updateData("departments", updatedDepartments)

      toast({
        title: "Department updated",
        description: "The department has been successfully updated.",
      })

      router.push(`/dashboard/instructor/departments/${departmentId}`)
    } catch (error) {
      console.error("Error updating department:", error)
      toast({
        title: "Error",
        description: "Failed to update department.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href={`/dashboard/instructor/departments/${departmentId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Department
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Department</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Department Name
                </label>
                <Input id="name" name="name" value={department?.name || ""} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">
                  Department Code
                </label>
                <Input id="code" name="code" value={department?.code || ""} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={department?.description || ""}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
