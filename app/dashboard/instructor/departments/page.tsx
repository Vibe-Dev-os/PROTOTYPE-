"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getData } from "@/lib/data-utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { GraduationCap, Users, BookOpen, FileText, Plus } from "lucide-react"

interface Department {
  id: string
  name: string
  code: string
  description: string
  courses: number
  students: number
}

export default function InstructorDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const departmentsData = await getData("departments")

        // Enhance departments with additional data
        const enhancedDepartments = departmentsData.map((dept: any) => ({
          ...dept,
          courses: Math.floor(Math.random() * 10) + 5, // Mock data
          students: Math.floor(Math.random() * 100) + 50, // Mock data
        }))

        setDepartments(enhancedDepartments)
      } catch (error) {
        console.error("Error fetching departments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="flex flex-col overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Academic Departments</h1>
        <p className="text-muted-foreground">Manage and view all academic departments</p>
      </div>

      <Tabs defaultValue="grid" className="mb-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <Button asChild>
            <Link href="/dashboard/instructor/departments/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Link>
          </Button>
        </div>

        <TabsContent value="grid" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((department) => (
              <Link href={`/dashboard/instructor/departments/${department.id.toLowerCase()}`} key={department.id}>
                <Card className="flex flex-col h-full overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {department.name}
                      <Badge variant="outline">{department.code}</Badge>
                    </CardTitle>
                    <CardDescription>Academic Department</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="line-clamp-2 text-sm text-muted-foreground">{department.description}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{department.courses} Courses</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{department.students} Students</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Manage Department
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Departments</CardTitle>
              <CardDescription>A complete list of all academic departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map((department) => (
                  <Link
                    href={`/dashboard/instructor/departments/${department.id.toLowerCase()}`}
                    key={department.id}
                    className="block"
                  >
                    <div className="flex items-center justify-between rounded-lg border p-4 transition-all hover:bg-accent">
                      <div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{department.name}</h3>
                          <Badge variant="outline">{department.code}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{department.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium">{department.courses}</span>
                          <span className="text-xs text-muted-foreground">Courses</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium">{department.students}</span>
                          <span className="text-xs text-muted-foreground">Students</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Manage</span>
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
