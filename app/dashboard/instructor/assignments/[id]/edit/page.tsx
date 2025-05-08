"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AssignmentForm } from "@/components/assignment-form"
import { getData } from "@/lib/data-utils"

export default function EditAssignmentPage() {
  const params = useParams()
  const assignmentId = params.id as string

  const [assignment, setAssignment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAssignment() {
      try {
        const assignments = (await getData("assignments")) || []
        const foundAssignment = assignments.find((a: any) => a.id === assignmentId)

        if (foundAssignment) {
          setAssignment(foundAssignment)
        }
      } catch (error) {
        console.error("Error fetching assignment:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignment()
  }, [assignmentId])

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Assignment Not Found</h1>
          <p className="text-muted-foreground">The assignment you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Edit {assignment.type === "assignment" ? "Assignment" : "Activity"}</h1>
      <AssignmentForm initialData={assignment} isEditing={true} />
    </div>
  )
}
