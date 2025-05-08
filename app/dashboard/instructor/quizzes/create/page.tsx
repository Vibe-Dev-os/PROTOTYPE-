"use client"

import { QuizForm } from "@/components/quiz-form"

export default function CreateQuizPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Create New Quiz</h1>
        <p className="text-muted-foreground">Create a new quiz for your course</p>
      </div>
      <QuizForm />
    </div>
  )
}
