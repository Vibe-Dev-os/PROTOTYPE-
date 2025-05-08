"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, FileText, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getData } from "@/lib/data-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredLessons, setFilteredLessons] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const lessonsData = (await getData("lessons")) as any[]
        const coursesData = (await getData("courses")) as any[]
        const departmentsData = (await getData("departments")) as any[]

        setLessons(lessonsData)
        setFilteredLessons(lessonsData)
        setCourses(coursesData)
        setDepartments(departmentsData)
      } catch (error) {
        console.error("Error fetching lessons:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLessons(lessons)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = lessons.filter(
        (lesson) => lesson.title.toLowerCase().includes(query) || lesson.content.toLowerCase().includes(query),
      )
      setFilteredLessons(filtered)
    }
  }, [searchQuery, lessons])

  const getCourseById = (courseId: string) => {
    return courses.find((course) => course.id === courseId)
  }

  const getDepartmentById = (departmentId: string) => {
    return departments.find((dept) => dept.id === departmentId)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Lessons</h1>
          <p className="text-muted-foreground">Browse all available learning materials</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search lessons..."
            className="w-full pl-8 md:w-[300px]"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Lessons</TabsTrigger>
          <TabsTrigger value="recent">Recently Added</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => {
                const course = getCourseById(lesson.courseId)
                const department = course ? getDepartmentById(course.departmentId) : null

                return (
                  <Card key={lesson.id} className="overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      </div>
                      <CardDescription className="mt-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>
                          {course?.code} - {course?.name}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <Badge variant="outline">{department?.code || "Unknown Department"}</Badge>
                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                          {lesson.content.substring(0, 150)}...
                        </p>
                      </div>
                      <Button asChild className="w-full">
                        <Link href={`/dashboard/student/lessons/${lesson.id}`}>View Lesson</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                {searchQuery ? "No lessons match your search query" : "No lessons available"}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="recent">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLessons.length > 0 ? (
              [...filteredLessons]
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 6)
                .map((lesson) => {
                  const course = getCourseById(lesson.courseId)
                  const department = course ? getDepartmentById(course.departmentId) : null

                  return (
                    <Card key={lesson.id} className="overflow-hidden">
                      <CardHeader className="bg-primary/5 pb-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        </div>
                        <CardDescription className="mt-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>
                            {course?.code} - {course?.name}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <Badge variant="outline">{department?.code || "Unknown Department"}</Badge>
                          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                            {lesson.content.substring(0, 150)}...
                          </p>
                        </div>
                        <Button asChild className="w-full">
                          <Link href={`/dashboard/student/lessons/${lesson.id}`}>View Lesson</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                {searchQuery ? "No lessons match your search query" : "No lessons available"}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
