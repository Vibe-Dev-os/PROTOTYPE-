"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BrainCircuit, Clock, FileText, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getData } from "@/lib/data-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredQuizzes, setFilteredQuizzes] = useState<any[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const quizzesData = (await getData("quizzes")) as any[]
        const coursesData = (await getData("courses")) as any[]
        const departmentsData = (await getData("departments")) as any[]

        setQuizzes(quizzesData)
        setFilteredQuizzes(quizzesData)
        setCourses(coursesData)
        setDepartments(departmentsData)
      } catch (error) {
        console.error("Error fetching quizzes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    async function checkEnrollment() {
      try {
        // In a real app, this would check the current user's enrollment
        // For now, we'll simulate this with mock data
        const userEnrollments = (await getData("enrollments")) || []
        const currentUserId = "current-user-id" // This would come from auth

        // Get user's enrolled subjects
        const userSubjectIds = userEnrollments
          .filter((enrollment: any) => enrollment.userId === currentUserId)
          .map((enrollment: any) => enrollment.subjectId)

        // Filter quizzes to only show those from subjects the user is enrolled in
        const enrolledQuizzes = quizzes.filter((quiz: any) => {
          const course = getCourseById(quiz.courseId)
          // Check if the course's subject is in the user's enrolled subjects
          return course && userSubjectIds.includes(course.subjectId)
        })

        setFilteredQuizzes(enrolledQuizzes)
      } catch (error) {
        console.error("Error checking enrollment:", error)
      }
    }

    if (quizzes.length > 0) {
      checkEnrollment()
    }
  }, [quizzes])

  useEffect(() => {
    filterQuizzes()
  }, [searchQuery, selectedDepartment, quizzes])

  const filterQuizzes = () => {
    let filtered = [...quizzes]

    // First check enrollment (in a real app)
    // This is a simplified version
    const userEnrollments = [] // This would come from the enrollment check

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (quiz) => quiz.title.toLowerCase().includes(query) || quiz.description.toLowerCase().includes(query),
      )
    }

    // Filter by department
    if (selectedDepartment !== "all") {
      filtered = filtered.filter((quiz) => {
        const course = getCourseById(quiz.courseId)
        return course && course.departmentId === selectedDepartment
      })
    }

    setFilteredQuizzes(filtered)
  }

  const getCourseById = (courseId: string) => {
    return courses.find((course) => course.id === courseId)
  }

  const getDepartmentById = (departmentId: string) => {
    return departments.find((dept) => dept.id === departmentId)
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
          <h1 className="text-2xl font-bold md:text-3xl">Quizzes</h1>
          <p className="text-muted-foreground">Test your knowledge with interactive quizzes</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search quizzes..."
            className="w-full pl-8 md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Filter by Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.code} - {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => {
            const course = getCourseById(quiz.courseId)
            const department = course ? getDepartmentById(course.departmentId) : null

            return (
              <Card key={quiz.id} className="overflow-hidden">
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
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
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{quiz.timeLimit} minutes</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{quiz.description}</p>
                    <p className="mt-1 text-sm font-medium">
                      {quiz.questions.length} {quiz.questions.length === 1 ? "question" : "questions"}
                    </p>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/student/quizzes/${quiz.id}`}>Take Quiz</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            {searchQuery || selectedDepartment !== "all"
              ? "No quizzes match your search criteria"
              : "No quizzes available"}
          </div>
        )}
      </div>
    </div>
  )
}
