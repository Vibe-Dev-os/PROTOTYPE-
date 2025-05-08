"use client"

import { LessonForm } from "@/components/lesson-form"

export default function CreateLessonPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Create New Lesson</h1>
        <p className="text-muted-foreground">Create a new lesson for your course</p>
      </div>
      <LessonForm />
    </div>
  )
}
