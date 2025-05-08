"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getData, updateData } from "@/lib/data-utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, CalendarClock, Edit, Trash } from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"

export default function AssignmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const assignmentId = params.id as string

  const [assignment, setAssignment] = useState<any>(null)
  const [subject, setSubject] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const assignments = (await getData("assignments")) || []
        const foundAssignment = assignments.find((a: any) => a.id === assignmentId)

        if (foundAssignment) {
          setAssignment(foundAssignment)

          // Fetch subject data
          const subjects = (await getData("subjects")) || []
          const foundSubject = subjects.find((s: any) => s.id === foundAssignment.subjectId)
          setSubject(foundSubject)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [assignmentId])

  const handleDelete = async () => {
    try {
      const assignments = (await getData("assignments")) || []
      const updatedAssignments = assignments.filter((a: any) => a.id !== assignmentId)

      await updateData("assignments", updatedAssignments)

      toast({
        title: "Success",
        description: `${assignment.type === "assignment" ? "Assignment" : "Activity"} deleted successfully.`,
      })

      router.push("/dashboard/instructor/assignments")
    } catch (error) {
      console.error("Error deleting assignment:", error)
      toast({
        title: "Error",
        description: "Failed to delete. Please try again.",
        variant: "destructive",
      })
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

  if (!assignment) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Assignment Not Found</h1>
          <p className="text-muted-foreground">The assignment you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/instructor/assignments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assignments
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/instructor/assignments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assignments
          </Link>
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold md:text-3xl">{assignment.title}</h1>
            <Badge>{assignment.type === "assignment" ? "Assignment" : "Activity"}</Badge>
          </div>
          {subject && (
            <p className="text-muted-foreground">
              {subject.code} - {subject.name}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/instructor/assignments/${assignmentId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  {assignment.type === "assignment" ? " assignment" : " activity"} and remove it from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{assignment.description}</p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Points</h3>
                <p>{assignment.points} points</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Due Date</h3>
                <div className="flex items-center">
                  <CalendarClock className="mr-2 h-4 w-4 text-muted-foreground" />
                  {format(new Date(assignment.dueDate), "PPP")}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium">Status</h3>
                <Badge variant={assignment.status === "active" ? "default" : "secondary"}>
                  {assignment.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No submissions yet.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled>
                View All Submissions
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
