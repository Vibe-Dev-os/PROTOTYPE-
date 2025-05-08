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
import { FileUpload } from "@/components/file-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LessonFormProps {
  lessonId?: string
}

export function LessonForm({ lessonId }: LessonFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [references, setReferences] = useState("")
  const [courseId, setCourseId] = useState("")
  const [courses, setCourses] = useState<any[]>([])
  const [attachments, setAttachments] = useState<any[]>([])
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

        // If editing an existing lesson, fetch its data
        if (lessonId) {
          const lessonsData = (await getData("lessons")) as any[]
          const lesson = lessonsData.find((l) => l.id === lessonId)

          if (lesson) {
            setTitle(lesson.title)
            setContent(lesson.content)
            setReferences(lesson.references.join("\n"))
            setCourseId(lesson.courseId)

            // Set attachments if they exist
            if (lesson.attachments) {
              setAttachments(lesson.attachments)
            }
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
  }, [lessonId, toast])

  const handleFileUpload = (files: File[]) => {
    // In a real application, you would upload these files to a server
    // For this demo, we'll just create mock attachments
    const newAttachments = files.map((file) => ({
      name: file.name,
      url: "#", // In a real app, this would be the URL to the uploaded file
      type: file.name.split(".").pop() || "",
      size: file.size,
    }))

    setAttachments([...attachments, ...newAttachments])

    toast({
      title: "Files uploaded",
      description: `${files.length} file(s) have been uploaded.`,
    })
  }

  const handleFileDelete = (fileName: string) => {
    setAttachments(attachments.filter((attachment) => attachment.name !== fileName))

    toast({
      title: "File removed",
      description: `${fileName} has been removed.`,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!title || !content || !courseId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields.",
        })
        setIsLoading(false)
        return
      }

      // Get existing lessons
      const lessonsData = (await getData("lessons")) as any[]

      // Prepare the lesson object
      const referencesArray = references
        .split("\n")
        .map((ref) => ref.trim())
        .filter((ref) => ref.length > 0)

      const now = new Date().toISOString()

      let updatedLessons

      if (lessonId) {
        // Update existing lesson
        updatedLessons = lessonsData.map((lesson) => {
          if (lesson.id === lessonId) {
            return {
              ...lesson,
              title,
              content,
              references: referencesArray,
              courseId,
              attachments,
              updatedAt: now,
            }
          }
          return lesson
        })

        toast({
          title: "Success",
          description: "Lesson updated successfully.",
        })
      } else {
        // Create new lesson
        const newLesson = {
          id: Date.now().toString(),
          title,
          content,
          references: referencesArray,
          courseId,
          attachments,
          createdAt: now,
          updatedAt: now,
          createdBy: user?.id || "instructor-1",
        }

        updatedLessons = [...lessonsData, newLesson]

        toast({
          title: "Success",
          description: "Lesson created successfully.",
        })
      }

      // Store updated lessons
      await storeData("lessons", updatedLessons)

      // Redirect to lessons page
      router.push("/dashboard/instructor/lessons")
    } catch (error) {
      console.error("Error saving lesson:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save lesson. Please try again.",
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
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Lesson Content</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Lesson Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter lesson title"
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
                  <Label htmlFor="content">Lesson Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter lesson content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="references">References (one per line)</Label>
                  <Textarea
                    id="references"
                    placeholder="Enter references, one per line"
                    value={references}
                    onChange={(e) => setReferences(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attachments">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Upload Lesson Materials</Label>
                  <FileUpload
                    onFileUpload={handleFileUpload}
                    existingFiles={attachments}
                    onFileDelete={handleFileDelete}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : lessonId ? "Update Lesson" : "Create Lesson"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
