"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Save } from "lucide-react"

interface StudentNotesProps {
  lessonId: string
  initialNote?: string
}

export function StudentNotes({ lessonId, initialNote = "" }: StudentNotesProps) {
  const [note, setNote] = useState(initialNote)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { toast } = useToast()

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNote = localStorage.getItem(`acadGuide:note:${lessonId}`)
    if (savedNote) {
      setNote(savedNote)

      // Get the last saved timestamp
      const savedTimestamp = localStorage.getItem(`acadGuide:note:${lessonId}:timestamp`)
      if (savedTimestamp) {
        setLastSaved(new Date(savedTimestamp))
      }
    }
  }, [lessonId])

  // Auto-save notes when they change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (note !== initialNote) {
        saveNote()
      }
    }, 2000) // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer)
  }, [note, initialNote])

  const saveNote = async () => {
    setIsSaving(true)
    try {
      // Save to localStorage
      localStorage.setItem(`acadGuide:note:${lessonId}`, note)

      // Save timestamp
      const now = new Date()
      localStorage.setItem(`acadGuide:note:${lessonId}:timestamp`, now.toISOString())
      setLastSaved(now)

      toast({
        title: "Notes saved",
        description: "Your notes have been saved successfully.",
        duration: 2000,
      })
    } catch (error) {
      console.error("Error saving notes:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your notes. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const formatLastSaved = () => {
    if (!lastSaved) return ""

    return `Last saved: ${lastSaved.toLocaleDateString()} at ${lastSaved.toLocaleTimeString()}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">My Notes</h3>
        <Button size="sm" onClick={saveNote} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      <Textarea
        placeholder="Write your notes here..."
        className="min-h-[200px]"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {lastSaved && <p className="text-xs text-muted-foreground">{formatLastSaved()}</p>}
    </div>
  )
}
