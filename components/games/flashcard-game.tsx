"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getData } from "@/lib/data-utils"
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react"

interface FlashcardGameProps {
  flashcardSetId: string
}

export function FlashcardGame({ flashcardSetId }: FlashcardGameProps) {
  const [flashcardSet, setFlashcardSet] = useState<any>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [cards, setCards] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const flashcardsData = (await getData("flashcards")) as any[]
        const set = flashcardsData.find((set) => set.id === flashcardSetId)

        if (set) {
          setFlashcardSet(set)
          setCards(set.cards)
        }
      } catch (error) {
        console.error("Error fetching flashcard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [flashcardSetId])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      setCurrentCardIndex(0)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    } else {
      setCurrentCardIndex(cards.length - 1)
      setIsFlipped(false)
    }
  }

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  const handleReset = () => {
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!flashcardSet) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Flashcard set not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{flashcardSet.title}</CardTitle>
          <CardDescription>{flashcardSet.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="relative w-full max-w-md mx-auto cursor-pointer perspective-1000" onClick={handleFlip}>
            <div
              className={`relative w-full min-h-[300px] transform-style-3d transition-transform duration-500 ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center rounded-xl border bg-card p-6 backface-hidden">
                <div className="text-center text-xl font-medium">{cards[currentCardIndex]?.term}</div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-xl border bg-muted p-6 rotate-y-180 backface-hidden">
                <div className="text-center">{cards[currentCardIndex]?.definition}</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex w-full items-center justify-between">
            <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentCardIndex === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm text-muted-foreground">
              Card {currentCardIndex + 1} of {cards.length}
            </div>
            <Button variant="outline" size="icon" onClick={handleNext} disabled={currentCardIndex === cards.length - 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleShuffle}>
            <Shuffle className="mr-2 h-4 w-4" />
            Shuffle
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
