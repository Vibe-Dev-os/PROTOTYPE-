"use client"

import { FlashcardForm } from "@/components/flashcard-form"

export default function CreateFlashcardSetPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Create New Flashcard Set</h1>
        <p className="text-muted-foreground">Create a new set of flashcards for your course</p>
      </div>
      <FlashcardForm />
    </div>
  )
}
