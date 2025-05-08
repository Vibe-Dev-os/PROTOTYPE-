"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Calendar, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getData } from "@/lib/data-utils"
import { Separator } from "@/components/ui/separator"

export default function ViewLessonPage({ params }: { params: { id: string } }) {
  const [lesson, setLesson] = useState<any>(null)
  const [course, setCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const lessonsData = (await getData("lessons")) as any[]
        const lesson = lessonsData.find((l) => l.id === params.id)

        if (lesson) {
          setLesson(lesson)

          // Fetch course data
          const coursesData = (await getData("courses")) as any[]
          const course = coursesData.find((c) => c.id === lesson.courseId)
          setCourse(course)
        }
      } catch (error) {
        console.error("Error fetching lesson data:", error)
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

  if (!lesson) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Lesson not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/instructor/lessons">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lessons
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href={`/dashboard/instructor/lessons/${params.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Lesson
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>
              {course?.code} - {course?.name}
            </span>
          </div>
          <CardTitle className="text-2xl md:text-3xl">{lesson.title}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Last updated: {new Date(lesson.updatedAt).toLocaleDateString()}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose prose-sm max-w-none dark:prose-invert md:prose-base">
            {lesson.content.split("\n").map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {lesson.references && lesson.references.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="mb-4 text-lg font-semibold">References</h3>
                <ul className="list-inside list-disc space-y-2">
                  {lesson.references.map((reference: string, index: number) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {reference}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
