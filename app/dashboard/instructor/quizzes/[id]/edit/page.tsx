"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { QuizForm } from "@/components/quiz-form"
import { getData } from "@/lib/data-utils"

export default function EditQuizPage({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const quizzesData = (await getData("quizzes")) as any[]
        const quiz = quizzesData.find((q) => q.id === params.id)

        if (quiz) {
          setQuiz(quiz)
        } else {
          // Quiz not found, redirect to quizzes page
          router.push("/dashboard/instructor/quizzes")
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error)
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

  if (!quiz) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">Quiz not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Edit Quiz</h1>
        <p className="text-muted-foreground">Update quiz content and questions</p>
      </div>
      <QuizForm quizId={params.id} />
    </div>
  )
}
