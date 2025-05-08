"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getData } from "@/lib/data-utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CoursePage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<any>(null)
  const [department, setDepartment] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch course data
        const coursesData = (await getData("courses")) as any[]
        const course = coursesData.find((c) => c.id === params.id)
        setCourse(course)

        if (course) {
          // Fetch department data
          const departmentsData = (await getData("departments")) as any[]
          const department = departmentsData.find((d) => d.id === course.departmentId)
          setDepartment(department)

          // Fetch lessons for this course
          const lessonsData = (await getData("lessons")) as any[]
          const courseLessons = lessonsData.filter((l) => l.courseId === params.id)
          setLessons(courseLessons)

          // Fetch flashcards for this course
          const flashcardsData = (await getData("flashcards")) as any[]
          const courseFlashcards = flashcardsData.filter((f) => f.courseId === params.id)
          setFlashcards(courseFlashcards)

          // Fetch quizzes for this course
          const quizzesData = (await getData("quizzes")) as any[]
          const courseQuizzes = quizzesData.filter((q) => q.courseId === params.id)
          setQuizzes(courseQuizzes)
        }
      } catch (error) {
        console.error("Error fetching course data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Course not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href={`/dashboard/student/departments/${course.departmentId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Department
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold md:text-3xl">{course.name}</h1>
              <Badge variant="outline">{course.code}</Badge>
            </div>
            <p className="text-muted-foreground">
              {department?.name} • Year {course.year}, Semester {course.semester}
            </p>
          </div>
        </div>
        <p className="mt-4 text-muted-foreground">{course.description}</p>
      </div>

      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>
        <TabsContent value="lessons">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lessons.length > 0 ? (
              lessons.map((lesson) => (
                <Card key={lesson.id} className="overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    </div>
                    <CardDescription className="mt-2">
                      Last updated: {new Date(lesson.updatedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                      {lesson.content.substring(0, 150)}...
                    </p>
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/student/lessons/${lesson.id}`}>View Lesson</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                No lessons available for this course
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="flashcards">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {flashcards.length > 0 ? (
              flashcards.map((set) => (
                <Card key={set.id} className="overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{set.title}</CardTitle>
                    </div>
                    <CardDescription className="mt-2">
                      {set.cards.length} {set.cards.length === 1 ? "card" : "cards"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="mb-4 text-sm text-muted-foreground">{set.description}</p>
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/student/flashcards/${set.id}`}>Practice Flashcards</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                No flashcards available for this course
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="quizzes">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <Card key={quiz.id} className="overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    </div>
                    <CardDescription className="mt-2">
                      {quiz.questions.length} questions • {quiz.timeLimit} minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="mb-4 text-sm text-muted-foreground">{quiz.description}</p>
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/student/quizzes/${quiz.id}`}>Take Quiz</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                No quizzes available for this course
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
