"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LessonForm } from "@/components/lesson-form"
import { getData } from "@/lib/data-utils"

export default function EditLessonPage({ params }: { params: { id: string } }) {
  const [lesson, setLesson] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const lessonsData = (await getData("lessons")) as any[]
        const lesson = lessonsData.find((l) => l.id === params.id)

        if (lesson) {
          setLesson(lesson)
        } else {
          // Lesson not found, redirect to lessons page
          router.push("/dashboard/instructor/lessons")
        }
      } catch (error) {
        console.error("Error fetching lesson data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

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
        <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">Lesson not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Edit Lesson</h1>
        <p className="text-muted-foreground">Update lesson content and information</p>
      </div>
      <LessonForm lessonId={params.id} />
    </div>
  )
}
