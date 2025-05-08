"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getData, storeData } from "@/lib/data-utils"
import { toast } from "@/components/ui/use-toast"

export function SubjectForm({ departmentId }: { departmentId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    subjectCode: "",
    subjectName: "",
    description: "",
    credits: "3",
    semester: "1",
    prerequisite: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Get departments data
      const departments = (await getData("departments")) || []
      const department = departments.find((d: any) => d.id === departmentId)

      if (!department) {
        toast({
          title: "Error",
          description: "Department not found",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Create new subject
      const newSubject = {
        id: `${formData.subjectCode.toLowerCase()}`,
        code: formData.subjectCode,
        name: formData.subjectName,
        description: formData.description,
        credits: Number.parseInt(formData.credits),
        semester: Number.parseInt(formData.semester),
        prerequisite: formData.prerequisite || null,
        departmentId: departmentId,
        createdAt: new Date().toISOString(),
      }

      // Get existing subjects
      const subjects = (await getData("subjects")) || []

      // Check if subject code already exists
      if (subjects.some((subject: any) => subject.code === formData.subjectCode)) {
        toast({
          title: "Error",
          description: "Subject code already exists",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Add new subject to subjects store
      await storeData("subjects", [...subjects, newSubject])

      // Update department subjects count
      department.subjectCount = (department.subjectCount || 0) + 1
      await storeData(
        "departments",
        departments.map((d: any) => (d.id === departmentId ? department : d)),
      )

      toast({
        title: "Success",
        description: "Subject added successfully",
      })

      // Reset form
      setFormData({
        subjectCode: "",
        subjectName: "",
        description: "",
        credits: "3",
        semester: "1",
        prerequisite: "",
      })

      // Navigate to department page
      router.push(`/dashboard/instructor/departments/${departmentId}`)
      router.refresh()
    } catch (error) {
      console.error("Error adding subject:", error)
      toast({
        title: "Error",
        description: "Failed to add subject",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Subject</CardTitle>
        <CardDescription>Create a new subject for this department</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subjectCode">Subject Code</Label>
              <Input
                id="subjectCode"
                name="subjectCode"
                placeholder="CS101"
                value={formData.subjectCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjectName">Subject Name</Label>
              <Input
                id="subjectName"
                name="subjectName"
                placeholder="Introduction to Programming"
                value={formData.subjectName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter subject description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Select value={formData.credits} onValueChange={(value) => handleSelectChange("credits", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select credits" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 credit</SelectItem>
                  <SelectItem value="2">2 credits</SelectItem>
                  <SelectItem value="3">3 credits</SelectItem>
                  <SelectItem value="4">4 credits</SelectItem>
                  <SelectItem value="5">5 credits</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={formData.semester} onValueChange={(value) => handleSelectChange("semester", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">First Semester</SelectItem>
                  <SelectItem value="2">Second Semester</SelectItem>
                  <SelectItem value="3">Summer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prerequisite">Prerequisite (Optional)</Label>
            <Input
              id="prerequisite"
              name="prerequisite"
              placeholder="e.g., CS100"
              value={formData.prerequisite}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
                Adding...
              </>
            ) : (
              "Add Subject"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
