"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getData, updateData } from "@/lib/data-utils"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { v4 as uuidv4 } from "uuid"

export default function CreateDepartmentPage() {
  const router = useRouter()
  const [department, setDepartment] = useState({
    id: uuidv4(),
    name: "",
    code: "",
    description: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDepartment((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Validate department code uniqueness
      const departments = (await getData("departments")) || []
      const codeExists = departments.some((dept: any) => dept.code.toLowerCase() === department.code.toLowerCase())

      if (codeExists) {
        toast({
          title: "Error",
          description: "A department with this code already exists.",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      // Add new department
      const updatedDepartments = [...departments, department]
      await updateData("departments", updatedDepartments)

      toast({
        title: "Department created",
        description: "The department has been successfully created.",
      })

      router.push("/dashboard/instructor/departments")
    } catch (error) {
      console.error("Error creating department:", error)
      toast({
        title: "Error",
        description: "Failed to create department.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/instructor/departments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Departments
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Department</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Department Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={department.name}
                  onChange={handleChange}
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">
                  Department Code
                </label>
                <Input
                  id="code"
                  name="code"
                  value={department.code}
                  onChange={handleChange}
                  placeholder="e.g., CS"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={department.description}
                onChange={handleChange}
                placeholder="Provide a description of the department..."
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Department
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
