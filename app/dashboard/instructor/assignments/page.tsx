"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getData } from "@/lib/data-utils"
import { CalendarClock, ClipboardList, Edit, FileText, Plus } from "lucide-react"
import { format } from "date-fns"

export default function InstructorAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const assignmentsData = (await getData("assignments")) || []
        const subjectsData = (await getData("subjects")) || []

        setAssignments(assignmentsData)
        setSubjects(subjectsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId)
    return subject ? `${subject.code} - ${subject.name}` : "Unknown Subject"
  }

  const assignmentsList = assignments.filter((a) => a.type === "assignment")
  const activitiesList = assignments.filter((a) => a.type === "activity")

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
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Assignments & Activities</h1>
          <p className="text-muted-foreground">Manage student assignments and activities</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/instructor/assignments/create">
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="assignments">
        <TabsList className="mb-4">
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          {assignmentsList.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assignmentsList.map((assignment) => (
                <Card key={assignment.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <Badge>{assignment.points} pts</Badge>
                    </div>
                    <CardDescription>{getSubjectName(assignment.subjectId)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{assignment.description}</p>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <CalendarClock className="mr-2 h-4 w-4" />
                      Due: {format(new Date(assignment.dueDate), "PPP")}
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/instructor/assignments/${assignment.id}`}>
                          <FileText className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/instructor/assignments/${assignment.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No Assignments Yet</h3>
                <p className="text-center text-muted-foreground mt-2">You haven't created any assignments yet.</p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/instructor/assignments/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Assignment
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activities">
          {activitiesList.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activitiesList.map((activity) => (
                <Card key={activity.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                      <Badge>{activity.points} pts</Badge>
                    </div>
                    <CardDescription>{getSubjectName(activity.subjectId)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{activity.description}</p>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <CalendarClock className="mr-2 h-4 w-4" />
                      Due: {format(new Date(activity.dueDate), "PPP")}
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/instructor/assignments/${activity.id}`}>
                          <FileText className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/instructor/assignments/${activity.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No Activities Yet</h3>
                <p className="text-center text-muted-foreground mt-2">You haven't created any activities yet.</p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/instructor/assignments/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Activity
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
