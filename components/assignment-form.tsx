"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"
import { getData, updateData } from "@/lib/data-utils"

interface AssignmentFormProps {
  subjectId?: string
  courseId?: string
  departmentId?: string
  initialData?: any
  isEditing?: boolean
}

export function AssignmentForm({
  subjectId,
  courseId,
  departmentId,
  initialData,
  isEditing = false,
}: AssignmentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    id: initialData?.id || uuidv4(),
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || "assignment", // assignment or activity
    subjectId: subjectId || initialData?.subjectId || "",
    courseId: courseId || initialData?.courseId || "",
    departmentId: departmentId || initialData?.departmentId || "",
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : new Date(),
    points: initialData?.points || 100,
    status: initialData?.status || "active",
  })

  const [subjects, setSubjects] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])

  useState(() => {
    async function fetchData() {
      try {
        const subjectsData = (await getData("subjects")) || []
        const coursesData = (await getData("courses")) || []

        setSubjects(subjectsData)
        setCourses(coursesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        dueDate: date,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const assignments = (await getData("assignments")) || []

      if (isEditing) {
        // Update existing assignment
        const updatedAssignments = assignments.map((assignment: any) =>
          assignment.id === formData.id ? formData : assignment,
        )
        await updateData("assignments", updatedAssignments)
        toast({
          title: "Success",
          description: `${formData.type === "assignment" ? "Assignment" : "Activity"} updated successfully.`,
        })
      } else {
        // Create new assignment
        const newAssignments = [...assignments, formData]
        await updateData("assignments", newAssignments)
        toast({
          title: "Success",
          description: `${formData.type === "assignment" ? "Assignment" : "Activity"} created successfully.`,
        })
      }

      // Redirect based on context
      if (subjectId) {
        router.push(`/dashboard/instructor/subjects/${subjectId}`)
      } else if (courseId) {
        router.push(`/dashboard/instructor/courses/${courseId}`)
      } else {
        router.push("/dashboard/instructor/assignments")
      }

      router.refresh()
    } catch (error) {
      console.error("Error saving assignment:", error)
      toast({
        title: "Error",
        description: "Failed to save. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing
            ? `Edit ${formData.type === "assignment" ? "Assignment" : "Activity"}`
            : `Create New ${formData.type === "assignment" ? "Assignment" : "Activity"}`}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Points</label>
              <Input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleChange}
                min={0}
                max={1000}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={formData.dueDate} onSelect={handleDateChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {!subjectId && !courseId && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select value={formData.subjectId} onValueChange={(value) => handleSelectChange("subjectId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
