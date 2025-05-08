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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface QuizFormProps {
  quizId?: string
}

interface Question {
  question: string
  options: string[]
  answer: number
}

export function QuizForm({ quizId }: QuizFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [courseId, setCourseId] = useState("")
  const [timeLimit, setTimeLimit] = useState("10")
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      options: ["", "", "", ""],
      answer: 0,
    },
  ])
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

        // If editing an existing quiz, fetch its data
        if (quizId) {
          const quizzesData = (await getData("quizzes")) as any[]
          const quiz = quizzesData.find((q) => q.id === quizId)

          if (quiz) {
            setTitle(quiz.title)
            setDescription(quiz.description)
            setCourseId(quiz.courseId)
            setTimeLimit(quiz.timeLimit.toString())
            setQuestions(quiz.questions)
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
  }, [quizId, toast])

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        answer: 0,
      },
    ])
  }

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...questions]
    newQuestions.splice(index, 1)
    setQuestions(newQuestions)
  }

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[index].question = value
    setQuestions(newQuestions)
  }

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = value
    setQuestions(newQuestions)
  }

  const handleAnswerChange = (questionIndex: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].answer = Number.parseInt(value)
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!title || !description || !courseId || !timeLimit) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields.",
        })
        setIsLoading(false)
        return
      }

      // Validate questions
      const invalidQuestions = questions.filter(
        (q) => q.question.trim() === "" || q.options.some((opt) => opt.trim() === "") || q.answer === undefined,
      )

      if (invalidQuestions.length > 0 || questions.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all questions, options, and select correct answers.",
        })
        setIsLoading(false)
        return
      }

      // Get existing quizzes
      const quizzesData = (await getData("quizzes")) as any[]

      // Prepare the quiz object
      const now = new Date().toISOString()

      let updatedQuizzes

      if (quizId) {
        // Update existing quiz
        updatedQuizzes = quizzesData.map((quiz) => {
          if (quiz.id === quizId) {
            return {
              ...quiz,
              title,
              description,
              courseId,
              timeLimit: Number.parseInt(timeLimit),
              questions,
              updatedAt: now,
            }
          }
          return quiz
        })

        toast({
          title: "Success",
          description: "Quiz updated successfully.",
        })
      } else {
        // Create new quiz
        const newQuiz = {
          id: Date.now().toString(),
          title,
          description,
          courseId,
          timeLimit: Number.parseInt(timeLimit),
          questions,
          createdAt: now,
          updatedAt: now,
          createdBy: user?.id || "instructor-1",
        }

        updatedQuizzes = [...quizzesData, newQuiz]

        toast({
          title: "Success",
          description: "Quiz created successfully.",
        })
      }

      // Store updated quizzes
      await storeData("quizzes", updatedQuizzes)

      // Redirect to quizzes page
      router.push("/dashboard/instructor/quizzes")
    } catch (error) {
      console.error("Error saving quiz:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save quiz. Please try again.",
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
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              placeholder="Enter quiz title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
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
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="1"
                max="120"
                placeholder="Enter time limit in minutes"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a description for this quiz"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Questions</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>

            {questions.map((question, qIndex) => (
              <div key={qIndex} className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium">Question {qIndex + 1}</h4>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove question</span>
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`question-${qIndex}`}>Question</Label>
                    <Input
                      id={`question-${qIndex}`}
                      placeholder="Enter question"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Options</Label>
                    <RadioGroup
                      value={question.answer.toString()}
                      onValueChange={(value) => handleAnswerChange(qIndex, value)}
                    >
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-option-${oIndex}`} />
                          <Input
                            placeholder={`Option ${oIndex + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            className="flex-1"
                            required
                          />
                        </div>
                      ))}
                    </RadioGroup>
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
              {isLoading ? "Saving..." : quizId ? "Update Quiz" : "Create Quiz"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
