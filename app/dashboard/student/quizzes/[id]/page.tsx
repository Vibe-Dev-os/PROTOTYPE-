"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getData } from "@/lib/data-utils"
import { QuizGame } from "@/components/quiz-game"

export default function QuizPage({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const quizzesData = (await getData("quizzes")) as any[]
        const quizData = quizzesData.find((q) => q.id === params.id)

        if (quizData) {
          setQuiz(quizData)
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error)
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
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/student/quizzes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Link>
        </Button>
      </div>

      <QuizGame quizId={params.id} />
    </div>
  )
}
