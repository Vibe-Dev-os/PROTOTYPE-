"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, Calendar, BrainCircuit, Bookmark, Search, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getBookmarks, removeBookmark } from "@/lib/data-utils"

interface BookmarkItem {
  id: string
  type: "lesson" | "event" | "flashcard" | "quiz"
  title: string
  timestamp: string
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [bookmarkToDelete, setBookmarkToDelete] = useState<BookmarkItem | null>(null)
  const { toast } = useToast()

  // Load bookmarks
  useEffect(() => {
    const loadBookmarks = () => {
      const loadedBookmarks = getBookmarks()
      setBookmarks(loadedBookmarks)
      setFilteredBookmarks(loadedBookmarks)
    }

    loadBookmarks()
    setIsLoading(false)

    // Set up an interval to check for new bookmarks every 5 seconds
    const intervalId = setInterval(loadBookmarks, 5000)

    return () => clearInterval(intervalId)
  }, [])

  // Filter bookmarks based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBookmarks(bookmarks)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = bookmarks.filter((bookmark) => bookmark.title.toLowerCase().includes(query))
      setFilteredBookmarks(filtered)
    }
  }, [searchQuery, bookmarks])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleDeleteClick = (bookmark: BookmarkItem) => {
    setBookmarkToDelete(bookmark)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!bookmarkToDelete) return

    try {
      if (removeBookmark(bookmarkToDelete.id, bookmarkToDelete.type)) {
        // Update local state
        const updatedBookmarks = bookmarks.filter(
          (bookmark) => !(bookmark.id === bookmarkToDelete.id && bookmark.type === bookmarkToDelete.type),
        )
        setBookmarks(updatedBookmarks)
        setFilteredBookmarks(updatedBookmarks)

        toast({
          title: "Bookmark removed",
          description: `${bookmarkToDelete.title} has been removed from your bookmarks.`,
        })
      }
    } catch (error) {
      console.error("Error removing bookmark:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove bookmark. Please try again.",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setBookmarkToDelete(null)
    }
  }

  const getBookmarkIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return <BookOpen className="h-5 w-5 text-primary" />
      case "event":
        return <Calendar className="h-5 w-5 text-primary" />
      case "flashcard":
        return <BookOpen className="h-5 w-5 text-primary" />
      case "quiz":
        return <BrainCircuit className="h-5 w-5 text-primary" />
      default:
        return <Bookmark className="h-5 w-5 text-primary" />
    }
  }

  const getBookmarkPath = (bookmark: BookmarkItem) => {
    switch (bookmark.type) {
      case "lesson":
        return `/dashboard/student/lessons/${bookmark.id}`
      case "event":
        return `/dashboard/student/events/${bookmark.id}`
      case "flashcard":
        return `/dashboard/student/flashcards/${bookmark.id}`
      case "quiz":
        return `/dashboard/student/quizzes/${bookmark.id}`
      default:
        return "#"
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">My Bookmarks</h1>
          <p className="text-muted-foreground">Access your saved content quickly</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bookmarks..."
            className="w-full pl-8 md:w-[300px]"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Bookmarks</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="learning">Learning Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookmarks.length > 0 ? (
              filteredBookmarks.map((bookmark, index) => (
                <Card key={`${bookmark.type}-${bookmark.id}-${index}`} className="overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-4">
                    <div className="flex items-center gap-2">
                      {getBookmarkIcon(bookmark.type)}
                      <CardTitle className="text-lg">{bookmark.title}</CardTitle>
                    </div>
                    <CardDescription className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {bookmark.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Bookmarked on {new Date(bookmark.timestamp).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link href={getBookmarkPath(bookmark)}>View</Link>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteClick(bookmark)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                {searchQuery ? "No bookmarks match your search query" : "You haven't bookmarked anything yet"}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="lessons">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookmarks.filter((b) => b.type === "lesson").length > 0 ? (
              filteredBookmarks
                .filter((b) => b.type === "lesson")
                .map((bookmark, index) => (
                  <Card key={`lesson-${bookmark.id}-${index}`} className="overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{bookmark.title}</CardTitle>
                      </div>
                      <CardDescription className="mt-2 text-xs text-muted-foreground">
                        Bookmarked on {new Date(bookmark.timestamp).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex gap-2">
                        <Button asChild className="flex-1">
                          <Link href={`/dashboard/student/lessons/${bookmark.id}`}>View Lesson</Link>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteClick(bookmark)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                {searchQuery ? "No lesson bookmarks match your search query" : "You haven't bookmarked any lessons yet"}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookmarks.filter((b) => b.type === "event").length > 0 ? (
              filteredBookmarks
                .filter((b) => b.type === "event")
                .map((bookmark, index) => (
                  <Card key={`event-${bookmark.id}-${index}`} className="overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{bookmark.title}</CardTitle>
                      </div>
                      <CardDescription className="mt-2 text-xs text-muted-foreground">
                        Bookmarked on {new Date(bookmark.timestamp).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex gap-2">
                        <Button asChild className="flex-1">
                          <Link href={`/dashboard/student/events/${bookmark.id}`}>View Event</Link>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteClick(bookmark)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                {searchQuery ? "No event bookmarks match your search query" : "You haven't bookmarked any events yet"}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="learning">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookmarks.filter((b) => b.type === "flashcard" || b.type === "quiz").length > 0 ? (
              filteredBookmarks
                .filter((b) => b.type === "flashcard" || b.type === "quiz")
                .map((bookmark, index) => (
                  <Card key={`learning-${bookmark.id}-${index}`} className="overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-4">
                      <div className="flex items-center gap-2">
                        {bookmark.type === "flashcard" ? (
                          <BookOpen className="h-5 w-5 text-primary" />
                        ) : (
                          <BrainCircuit className="h-5 w-5 text-primary" />
                        )}
                        <CardTitle className="text-lg">{bookmark.title}</CardTitle>
                      </div>
                      <CardDescription className="mt-2 flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {bookmark.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Bookmarked on {new Date(bookmark.timestamp).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex gap-2">
                        <Button asChild className="flex-1">
                          <Link href={getBookmarkPath(bookmark)}>
                            {bookmark.type === "flashcard" ? "Practice Flashcards" : "Take Quiz"}
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteClick(bookmark)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                {searchQuery
                  ? "No learning tool bookmarks match your search query"
                  : "You haven't bookmarked any learning tools yet"}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove bookmark?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this bookmark? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
