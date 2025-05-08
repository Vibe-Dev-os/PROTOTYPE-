"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addFeedback } from "@/lib/data-utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FeedbackForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedbackType, setFeedbackType] = useState<string>("improvement")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [departmentId, setDepartmentId] = useState<string | undefined>(undefined)
  const [courseId, setCourseId] = useState<string | undefined>(undefined)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!subject.trim() || !message.trim()) {
        throw new Error("Please fill in all required fields")
      }

      const result = await addFeedback({
        type: feedbackType as any,
        subject,
        message,
        departmentId,
        courseId,
      })

      if (result) {
        setSuccess(true)
        toast({
          title: "Feedback submitted",
          description: "Thank you for your feedback. It has been submitted anonymously.",
          variant: "default",
        })

        // Reset form
        setFeedbackType("improvement")
        setSubject("")
        setMessage("")
        setDepartmentId(undefined)
        setCourseId(undefined)
      } else {
        throw new Error("Failed to submit feedback")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting your feedback")
      toast({
        title: "Error",
        description: err.message || "An error occurred while submitting your feedback",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-[#1A1525] border-[#2D2A3D]">
      <CardHeader>
        <CardTitle className="text-white">Anonymous Feedback</CardTitle>
        <CardDescription className="text-gray-400">
          Share your thoughts, concerns, or suggestions anonymously. Your identity will not be recorded.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-900/20 border-green-900">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-500">Success</AlertTitle>
            <AlertDescription className="text-green-400">
              Your feedback has been submitted anonymously. Thank you for your input!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feedback-type" className="text-white">
              Feedback Type
            </Label>
            <RadioGroup
              id="feedback-type"
              value={feedbackType}
              onValueChange={setFeedbackType}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="improvement" id="improvement" className="border-violet-500 text-violet-500" />
                <Label htmlFor="improvement" className="text-gray-300">
                  Suggestion for Improvement
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="concern" id="concern" className="border-violet-500 text-violet-500" />
                <Label htmlFor="concern" className="text-gray-300">
                  Concern or Issue
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="praise" id="praise" className="border-violet-500 text-violet-500" />
                <Label htmlFor="praise" className="text-gray-300">
                  Praise or Positive Feedback
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="evaluation" id="evaluation" className="border-violet-500 text-violet-500" />
                <Label htmlFor="evaluation" className="text-gray-300">
                  Course/Instructor Evaluation
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" className="border-violet-500 text-violet-500" />
                <Label htmlFor="other" className="text-gray-300">
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-white">
              Subject <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              placeholder="Brief subject of your feedback"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="bg-[#0F0A1A] border-[#2D2A3D] text-white focus-visible:ring-violet-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-white">
              Related Department (Optional)
            </Label>
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger className="bg-[#0F0A1A] border-[#2D2A3D] text-white focus:ring-violet-500">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1525] border-[#2D2A3D] text-white">
                <SelectItem value="bsis">Bachelor of Science in Information Systems</SelectItem>
                <SelectItem value="bsit">Bachelor of Science in Information Technology</SelectItem>
                <SelectItem value="bscs">Bachelor of Science in Computer Science</SelectItem>
                <SelectItem value="bsed">Bachelor of Secondary Education</SelectItem>
                <SelectItem value="beed">Bachelor of Elementary Education</SelectItem>
                <SelectItem value="bped">Bachelor of Physical Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">
              Your Feedback <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Please provide detailed feedback. Your identity will remain anonymous."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="min-h-[150px] bg-[#0F0A1A] border-[#2D2A3D] text-white focus-visible:ring-violet-500"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-[#2D2A3D] pt-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="bg-transparent border-[#2D2A3D] text-gray-300 hover:bg-[#2D2A3D] hover:text-white"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !subject.trim() || !message.trim()}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          {isSubmitting ? (
            <>Submitting...</>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Anonymously
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
