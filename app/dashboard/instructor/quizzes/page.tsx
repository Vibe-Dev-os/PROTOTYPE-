"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BrainCircuit, Clock, FileText, Plus, Search, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getData, getUser, storeData } from "@/lib/data-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

export default function InstructorQuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredQuizzes, setFilteredQuizzes] = useState<any[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null)
  const { toast } = useToast()
  const user = getUser()

  useEffect(() => {
    fetchData()
  }, [])

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

  useEffect(() => {
    filterQuizzes()
  }, [searchQuery, selectedDepartment, quizzes])

  const filterQuizzes = () => {
    let filtered = [...quizzes]

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

  const handleDeleteClick = (quizId: string) => {
    setQuizToDelete(quizId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) return

    try {
      const updatedQuizzes = quizzes.filter((quiz) => quiz.id !== quizToDelete)
      await storeData("quizzes", updatedQuizzes)
      setQuizzes(updatedQuizzes)

      toast({
        title: "Quiz deleted",
        description: "The quiz has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting quiz:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the quiz. Please try again.",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setQuizToDelete(null)
    }
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
          <h1 className="text-2xl font-bold md:text-3xl">Manage Quizzes</h1>
          <p className="text-muted-foreground">Create and manage quizzes for your courses</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search quizzes..."
              className="w-full pl-8 md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/dashboard/instructor/quizzes/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Quiz
            </Link>
          </Button>
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
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/dashboard/instructor/quizzes/${quiz.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleDeleteClick(quiz.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quiz and all its questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
