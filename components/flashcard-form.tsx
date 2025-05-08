"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { getData, getUser, storeData } from "@/lib/data-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface FlashcardFormProps {
  flashcardSetId?: string
}

interface FlashcardCard {
  term: string
  definition: string
}

export function FlashcardForm({ flashcardSetId }: FlashcardFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [courseId, setCourseId] = useState("")
  const [cards, setCards] = useState<FlashcardCard[]>([{ term: "", definition: "" }])
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const user = getUser()

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch courses
        const coursesData = (await getData("courses")) as any[]
        setCourses(coursesData)

        // If editing an existing flashcard set, fetch its data
        if (flashcardSetId) {
          const flashcardsData = (await getData("flashcards")) as any[]
          const set = flashcardsData.find((s) => s.id === flashcardSetId)

          if (set) {
            setTitle(set.title)
            setDescription(set.description)
            setCourseId(set.courseId)
            setCards(set.cards)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data. Please try again.",
        })
      } finally {
        setIsFetching(false)
      }
    }

    fetchData()
  }, [flashcardSetId, toast])

  const handleAddCard = () => {
    setCards([...cards, { term: "", definition: "" }])
  }

  const handleRemoveCard = (index: number) => {
    const newCards = [...cards]
    newCards.splice(index, 1)
    setCards(newCards)
  }

  const handleCardChange = (index: number, field: keyof FlashcardCard, value: string) => {
    const newCards = [...cards]
    newCards[index][field] = value
    setCards(newCards)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!title || !description || !courseId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields.",
        })
        setIsLoading(false)
        return
      }

      // Validate cards
      const validCards = cards.filter((card) => card.term.trim() !== "" && card.definition.trim() !== "")
      if (validCards.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please add at least one valid flashcard.",
        })
        setIsLoading(false)
        return
      }

      // Get existing flashcard sets
      const flashcardsData = (await getData("flashcards")) as any[]

      // Prepare the flashcard set object
      const now = new Date().toISOString()

      let updatedFlashcards

      if (flashcardSetId) {
        // Update existing flashcard set
        updatedFlashcards = flashcardsData.map((set) => {
          if (set.id === flashcardSetId) {
            return {
              ...set,
              title,
              description,
              courseId,
              cards: validCards,
              updatedAt: now,
            }
          }
          return set
        })

        toast({
          title: "Success",
          description: "Flashcard set updated successfully.",
        })
      } else {
        // Create new flashcard set
        const newSet = {
          id: Date.now().toString(),
          title,
          description,
          courseId,
          cards: validCards,
          createdAt: now,
          updatedAt: now,
          createdBy: user?.id || "instructor-1",
        }

        updatedFlashcards = [...flashcardsData, newSet]

        toast({
          title: "Success",
          description: "Flashcard set created successfully.",
        })
      }

      // Store updated flashcards
      await storeData("flashcards", updatedFlashcards)

      // Redirect to flashcards page
      router.push("/dashboard/instructor/flashcards")
    } catch (error) {
      console.error("Error saving flashcard set:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save flashcard set. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Flashcard Set Title</Label>
            <Input
              id="title"
              placeholder="Enter flashcard set title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select value={courseId} onValueChange={setCourseId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a description for this flashcard set"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Flashcards</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddCard}>
                <Plus className="mr-2 h-4 w-4" />
                Add Card
              </Button>
            </div>

            {cards.map((card, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium">Card {index + 1}</h4>
                  {cards.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCard(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove card</span>
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`term-${index}`}>Term</Label>
                    <Input
                      id={`term-${index}`}
                      placeholder="Enter term"
                      value={card.term}
                      onChange={(e) => handleCardChange(index, "term", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`definition-${index}`}>Definition</Label>
                    <Textarea
                      id={`definition-${index}`}
                      placeholder="Enter definition"
                      value={card.definition}
                      onChange={(e) => handleCardChange(index, "definition", e.target.value)}
                      className="min-h-[80px]"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : flashcardSetId ? "Update Flashcard Set" : "Create Flashcard Set"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
