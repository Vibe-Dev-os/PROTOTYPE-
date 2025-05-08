"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getData } from "@/lib/data-utils"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentNotes } from "@/components/student-notes"
import { BookmarkButton } from "@/components/bookmark-button"

export default function LessonPage({ params }: { params: { id: string } }) {
  const [lesson, setLesson] = useState<any>(null)
  const [course, setCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [attachments, setAttachments] = useState<any[]>([])

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

          // Track this lesson as viewed in localStorage
          trackLessonView(lesson.id, lesson.title)

          // Mock attachments for demo purposes
          if (lesson.attachments) {
            setAttachments(lesson.attachments)
          } else {
            // Generate some mock attachments if none exist
            setAttachments([
              {
                name: "Lesson_Slides.pdf",
                url: "#",
                type: "pdf",
                size: 2500000,
              },
              {
                name: "Additional_Reading.docx",
                url: "#",
                type: "docx",
                size: 1200000,
              },
            ])
          }
        }
      } catch (error) {
        console.error("Error fetching lesson data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  // Track lesson view in localStorage for progress tracking
  const trackLessonView = (lessonId: string, lessonTitle: string) => {
    try {
      // Get existing viewed lessons
      const viewedLessonsJson = localStorage.getItem("acadGuide:viewedLessons")
      const viewedLessons = viewedLessonsJson ? JSON.parse(viewedLessonsJson) : []

      // Check if this lesson is already viewed
      const isAlreadyViewed = viewedLessons.some((item: any) => item.id === lessonId)

      if (!isAlreadyViewed) {
        // Add this lesson to viewed lessons
        const updatedViewedLessons = [
          ...viewedLessons,
          {
            id: lessonId,
            title: lessonTitle,
            timestamp: new Date().toISOString(),
          },
        ]
        localStorage.setItem("acadGuide:viewedLessons", JSON.stringify(updatedViewedLessons))
      }
    } catch (error) {
      console.error("Error tracking lesson view:", error)
    }
  }

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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/student/lessons">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lessons
          </Link>
        </Button>
        <BookmarkButton itemId={lesson.id} itemType="lesson" itemTitle={lesson.title} />
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="content">Lesson Content</TabsTrigger>
          <TabsTrigger value="notes">My Notes</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
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
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardContent className="p-6">
              <StudentNotes lessonId={lesson.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Attachments</CardTitle>
              <CardDescription>Download materials for offline access</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {attachments.length > 0 ? (
                <div className="space-y-4">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{attachment.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(attachment.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <a href={attachment.url} download target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No attachments available for this lesson</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
