"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getData } from "@/lib/data-utils"
import { FlashcardGame } from "@/components/flashcard-game"

export default function FlashcardPage({ params }: { params: { id: string } }) {
  const [flashcardSet, setFlashcardSet] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const flashcardsData = (await getData("flashcards")) as any[]
        const set = flashcardsData.find((set) => set.id === params.id)

        if (set) {
          setFlashcardSet(set)
        }
      } catch (error) {
        console.error("Error fetching flashcard data:", error)
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
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/student/flashcards">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Flashcards
          </Link>
        </Button>
      </div>

      <FlashcardGame flashcardSetId={params.id} />
    </div>
  )
}
