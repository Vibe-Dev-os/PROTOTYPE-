"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FlashcardForm } from "@/components/flashcard-form"
import { getData } from "@/lib/data-utils"

export default function EditFlashcardSetPage({ params }: { params: { id: string } }) {
  const [flashcardSet, setFlashcardSet] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const flashcardsData = (await getData("flashcards")) as any[]
        const set = flashcardsData.find((s) => s.id === params.id)

        if (set) {
          setFlashcardSet(set)
        } else {
          // Flashcard set not found, redirect to flashcards page
          router.push("/dashboard/instructor/flashcards")
        }
      } catch (error) {
        console.error("Error fetching flashcard data:", error)
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

  if (!flashcardSet) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">Flashcard set not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Edit Flashcard Set</h1>
        <p className="text-muted-foreground">Update flashcard set and cards</p>
      </div>
      <FlashcardForm flashcardSetId={params.id} />
    </div>
  )
}
