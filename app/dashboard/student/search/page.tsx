"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getData } from "@/lib/data-utils"
import { BookOpen, Calendar, FileText, BrainCircuit } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SearchItem {
  id: string
  title: string
  content?: string
  description?: string
  cards?: any[]
  questions?: any[]
  courseId?: string
  courseCode?: string
}

interface ResultSectionProps {
  title: string
  icon: React.ReactNode
  items: SearchItem[]
  type: string
  showAll?: boolean
}

interface ResultItemProps {
  item: SearchItem
  type: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [results, setResults] = useState<{
    lessons: SearchItem[]
    events: SearchItem[]
    flashcards: SearchItem[]
    quizzes: SearchItem[]
  }>({
    lessons: [],
    events: [],
    flashcards: [],
    quizzes: [],
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function searchContent() {
      if (!query) {
        setIsLoading(false)
        return
      }

      try {
        const lessons = (await getData("lessons")) || []
        const events = (await getData("events")) || []
        const flashcards = (await getData("flashcards")) || []
        const quizzes = (await getData("quizzes")) || []

        const searchResults = {
          lessons: lessons.filter(
            (lesson: any) =>
              lesson.title.toLowerCase().includes(query.toLowerCase()) ||
              lesson.content.toLowerCase().includes(query.toLowerCase()),
          ),
          events: events.filter(
            (event: any) =>
              event.title.toLowerCase().includes(query.toLowerCase()) ||
              event.description.toLowerCase().includes(query.toLowerCase()),
          ),
          flashcards: flashcards.filter(
            (deck: any) =>
              deck.title.toLowerCase().includes(query.toLowerCase()) ||
              deck.cards.some(
                (card: any) =>
                  card.front.toLowerCase().includes(query.toLowerCase()) ||
                  card.back.toLowerCase().includes(query.toLowerCase()),
              ),
          ),
          quizzes: quizzes.filter(
            (quiz: any) =>
              quiz.title.toLowerCase().includes(query.toLowerCase()) ||
              quiz.questions.some(
                (question: any) =>
                  question.text.toLowerCase().includes(query.toLowerCase()) ||
                  question.options.some((option: any) => option.text.toLowerCase().includes(query.toLowerCase())),
              ),
          ),
        }

        setResults(searchResults)
      } catch (error) {
        console.error("Error searching content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    searchContent()
  }, [query])

  const totalResults =
    results.lessons.length + results.events.length + results.flashcards.length + results.quizzes.length

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Search Results</h1>
        <p className="text-muted-foreground">
          {query ? (
            <>
              Found {totalResults} results for <span className="font-medium">"{query}"</span>
            </>
          ) : (
            "Enter a search term to find content"
          )}
        </p>
      </div>

      {query && totalResults > 0 ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Results ({totalResults})</TabsTrigger>
            {results.lessons.length > 0 && (
              <TabsTrigger value="lessons">Lessons ({results.lessons.length})</TabsTrigger>
            )}
            {results.events.length > 0 && <TabsTrigger value="events">Events ({results.events.length})</TabsTrigger>}
            {results.flashcards.length > 0 && (
              <TabsTrigger value="flashcards">Flashcards ({results.flashcards.length})</TabsTrigger>
            )}
            {results.quizzes.length > 0 && (
              <TabsTrigger value="quizzes">Quizzes ({results.quizzes.length})</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-6">
              {results.lessons.length > 0 && (
                <ResultSection
                  title="Lessons"
                  icon={<FileText className="h-5 w-5" />}
                  items={results.lessons}
                  type="lessons"
                />
              )}
              {results.events.length > 0 && (
                <ResultSection
                  title="Events"
                  icon={<Calendar className="h-5 w-5" />}
                  items={results.events}
                  type="events"
                />
              )}
              {results.flashcards.length > 0 && (
                <ResultSection
                  title="Flashcards"
                  icon={<BookOpen className="h-5 w-5" />}
                  items={results.flashcards}
                  type="flashcards"
                />
              )}
              {results.quizzes.length > 0 && (
                <ResultSection
                  title="Quizzes"
                  icon={<BrainCircuit className="h-5 w-5" />}
                  items={results.quizzes}
                  type="quizzes"
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="lessons">
            <ResultSection
              title="Lessons"
              icon={<FileText className="h-5 w-5" />}
              items={results.lessons}
              type="lessons"
              showAll
            />
          </TabsContent>

          <TabsContent value="events">
            <ResultSection
              title="Events"
              icon={<Calendar className="h-5 w-5" />}
              items={results.events}
              type="events"
              showAll
            />
          </TabsContent>

          <TabsContent value="flashcards">
            <ResultSection
              title="Flashcards"
              icon={<BookOpen className="h-5 w-5" />}
              items={results.flashcards}
              type="flashcards"
              showAll
            />
          </TabsContent>

          <TabsContent value="quizzes">
            <ResultSection
              title="Quizzes"
              icon={<BrainCircuit className="h-5 w-5" />}
              items={results.quizzes}
              type="quizzes"
              showAll
            />
          </TabsContent>
        </Tabs>
      ) : query ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-6xl">🔍</div>
            <h2 className="mt-4 text-xl font-semibold">No results found</h2>
            <p className="mt-2 text-center text-muted-foreground">
              We couldn't find any content matching your search. Try using different keywords or check your spelling.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function ResultSection({ title, icon, items, type, showAll = false }: ResultSectionProps) {
  const displayItems = showAll ? items : items.slice(0, 3)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">{icon}</div>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{items.length} results found</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayItems.map((item) => (
            <ResultItem key={item.id} item={item} type={type} />
          ))}

          {!showAll && items.length > 3 && (
            <div className="pt-2 text-center">
              <Link
                href={`?q=${encodeURIComponent(
                  typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("q") || "" : "",
                )}&tab=${type}`}
                className="text-sm text-primary hover:underline"
              >
                View all {items.length} results
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ResultItem({ item, type }: ResultItemProps) {
  return (
    <Link href={`/dashboard/student/${type}/${item.id}`}>
      <div className="rounded-lg border p-4 transition-colors hover:bg-accent">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{item.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {type === "lessons" && item.content}
              {type === "events" && item.description}
              {type === "flashcards" && `${item.cards?.length || 0} cards`}
              {type === "quizzes" && `${item.questions?.length || 0} questions`}
            </p>
          </div>
          {item.courseId && (
            <Badge variant="outline" className="ml-2">
              {item.courseCode || item.courseId}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  )
}
