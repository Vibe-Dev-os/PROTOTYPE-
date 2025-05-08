"use client"

import { useState, useEffect } from "react"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { isBookmarked, addBookmark, removeBookmark } from "@/lib/data-utils"

interface BookmarkButtonProps {
  id: string
  type: "lesson" | "event" | "flashcard" | "quiz"
  title: string
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function BookmarkButton({
  id,
  type,
  title,
  className,
  variant = "outline",
  size = "icon",
}: BookmarkButtonProps) {
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if the item is already bookmarked
    const checkBookmarkStatus = async () => {
      try {
        const bookmarked = await isBookmarked(id, type)
        setIsActive(bookmarked)
      } catch (error) {
        console.error("Error checking bookmark status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkBookmarkStatus()
  }, [id, type])

  const handleToggleBookmark = async () => {
    try {
      setIsLoading(true)

      if (isActive) {
        await removeBookmark(id, type)
        setIsActive(false)
      } else {
        await addBookmark(id, type, title)
        setIsActive(true)
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "relative transition-all duration-200",
        isActive
          ? "border-violet-500 bg-violet-900/30 text-violet-300"
          : "border-violet-900/50 bg-secondary text-violet-400 hover:bg-violet-900/30 hover:text-violet-300",
        isLoading && "opacity-70 cursor-not-allowed",
        className,
      )}
      onClick={handleToggleBookmark}
      disabled={isLoading}
      aria-label={isActive ? "Remove bookmark" : "Add bookmark"}
    >
      {isActive ? (
        <BookmarkCheck className={cn("h-4 w-4", isActive && "animate-pulse-violet")} />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {size !== "icon" && <span className="ml-2">{isActive ? "Bookmarked" : "Bookmark"}</span>}
    </Button>
  )
}
