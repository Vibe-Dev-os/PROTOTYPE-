"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getData } from "@/lib/data-utils"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, CheckCircle, Clock, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ViewedLesson {
  id: string
  title: string
  timestamp: string
}

interface QuizAttempt {
  id: string
  quizId: string
  quizTitle: string
  score: number
  totalQuestions: number
  timestamp: string
}

interface Activity {
  id: string
  title: string
  timestamp: string
  type?: string
  score?: number
  totalQuestions?: number
}

export default function ProgressPage() {
  const [viewedLessons, setViewedLessons] = useState<ViewedLesson[]>([])
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [lessons, setLessons] = useState<any[]>([])
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data from IndexedDB
        const coursesData = (await getData("courses")) as any[]
        const lessonsData = (await getData("lessons")) as any[]
        const quizzesData = (await getData("quizzes")) as any[]

        setCourses(coursesData)
        setLessons(lessonsData)
        setQuizzes(quizzesData)

        // Get viewed lessons from localStorage
        const viewedLessonsJson = localStorage.getItem("acadGuide:viewedLessons")
        if (viewedLessonsJson) {
          setViewedLessons(JSON.parse(viewedLessonsJson))
        }

        // Get quiz attempts from localStorage
        const quizAttemptsJson = localStorage.getItem("acadGuide:quizAttempts")
        if (quizAttemptsJson) {
          setQuizAttempts(JSON.parse(quizAttemptsJson))
        } else {
          // Create mock quiz attempts for demo purposes
          const mockAttempts = [
            {
              id: "attempt1",
              quizId: quizzesData[0]?.id || "quiz1",
              quizTitle: quizzesData[0]?.title || "Sample Quiz 1",
              score: 8,
              totalQuestions: 10,
              timestamp: new Date().toISOString(),
            },
            {
              id: "attempt2",
              quizId: quizzesData[1]?.id || "quiz2",
              quizTitle: quizzesData[1]?.title || "Sample Quiz 2",
              score: 7,
              totalQuestions: 10,
              timestamp: new Date().toISOString(),
            },
          ]
          setQuizAttempts(mockAttempts)
          localStorage.setItem("acadGuide:quizAttempts", JSON.stringify(mockAttempts))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (lessons.length === 0) return 0
    return Math.round((viewedLessons.length / lessons.length) * 100)
  }

  // Calculate average quiz score
  const calculateAverageQuizScore = () => {
    if (quizAttempts.length === 0) return 0
    const totalScore = quizAttempts.reduce((sum, attempt) => sum + (attempt.score / attempt.totalQuestions) * 100, 0)
    return Math.round(totalScore / quizAttempts.length)
  }

  // Group lessons by course
  const getLessonsByCourse = () => {
    const lessonsByCourse: Record<string, any[]> = {}

    courses.forEach((course) => {
      const courseLessons = lessons.filter((lesson) => lesson.courseId === course.id)
      if (courseLessons.length > 0) {
        lessonsByCourse[course.id] = courseLessons
      }
    })

    return lessonsByCourse
  }

  // Calculate course progress
  const calculateCourseProgress = (courseId: string) => {
    const courseLessons = lessons.filter((lesson) => lesson.courseId === courseId)
    if (courseLessons.length === 0) return 0

    const viewedCourseLessons = viewedLessons.filter((viewed) =>
      courseLessons.some((lesson) => lesson.id === viewed.id),
    )

    return Math.round((viewedCourseLessons.length / courseLessons.length) * 100)
  }

  // Combine viewed lessons and quiz attempts for the recent activity tab
  const getRecentActivities = (): Activity[] => {
    const lessonActivities: Activity[] = viewedLessons.map((lesson) => ({
      ...lesson,
      type: "lesson",
    }))

    const quizActivities: Activity[] = quizAttempts.map((attempt) => ({
      id: attempt.quizId,
      title: `Quiz: ${attempt.quizTitle}`,
      timestamp: attempt.timestamp,
      type: "quiz",
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
    }))

    return [...lessonActivities, ...quizActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">My Learning Progress</h1>
        <p className="text-muted-foreground">Track your academic journey and achievements</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateOverallProgress()}%</div>
            <Progress value={calculateOverallProgress()} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {viewedLessons.length} of {lessons.length} lessons completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quiz Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAverageQuizScore()}%</div>
            <Progress value={calculateAverageQuizScore()} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              Average score across {quizAttempts.length} quiz attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{viewedLessons.length + quizAttempts.length}</div>
            <p className="mt-2 text-xs text-muted-foreground">Total learning activities completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 days</div>
            <p className="mt-2 text-xs text-muted-foreground">Keep learning daily to increase your streak</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="mt-8">
        <TabsList className="mb-4">
          <TabsTrigger value="courses">Course Progress</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="quizzes">Quiz Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="grid gap-6 md:grid-cols-2">
            {courses.map((course) => {
              const progress = calculateCourseProgress(course.id)
              return (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle>{course.name}</CardTitle>
                    <CardDescription>{course.code}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{progress}% Complete</span>
                      <span className="text-sm text-muted-foreground">
                        {
                          viewedLessons.filter((viewed) =>
                            lessons.some((lesson) => lesson.id === viewed.id && lesson.courseId === course.id),
                          ).length
                        }{" "}
                        / {lessons.filter((lesson) => lesson.courseId === course.id).length} lessons
                      </span>
                    </div>
                    <Progress value={progress} className="mt-2" />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Learning Activities</CardTitle>
              <CardDescription>Your latest lessons and quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRecentActivities().map((activity, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      {activity.type === "quiz" ? (
                        <Trophy className="h-5 w-5 text-primary" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.title}</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                        {activity.type === "quiz" &&
                          activity.score !== undefined &&
                          activity.totalQuestions !== undefined && (
                            <Badge variant="outline" className="ml-2">
                              Score: {activity.score}/{activity.totalQuestions}
                            </Badge>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Performance</CardTitle>
              <CardDescription>Your quiz attempts and scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {quizAttempts.length > 0 ? (
                  quizAttempts
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((attempt, index) => {
                      const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100)
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-primary" />
                              <span className="font-medium">{attempt.quizTitle}</span>
                            </div>
                            <Badge variant={percentage >= 70 ? "default" : "outline"}>
                              {attempt.score}/{attempt.totalQuestions} ({percentage}%)
                            </Badge>
                          </div>
                          <Progress value={percentage} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            Attempted on {new Date(attempt.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      )
                    })
                ) : (
                  <p className="text-center text-muted-foreground">You haven't attempted any quizzes yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
