"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getData } from "@/lib/data-utils"
import { Clock, Trophy } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

interface QuizGameProps {
  quizId: string
}

export function QuizGame({ quizId }: QuizGameProps) {
  const [quiz, setQuiz] = useState<any>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const quizzesData = (await getData("quizzes")) as any[]
        const quizData = quizzesData.find((q) => q.id === quizId)

        if (quizData) {
          setQuiz(quizData)
          setTimeLeft(quizData.timeLimit * 60) // Convert minutes to seconds
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [quizId])

  useEffect(() => {
    if (!quiz || isQuizCompleted) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setIsQuizCompleted(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quiz, isQuizCompleted])

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswerSubmitted) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const currentQuestion = quiz.questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.answer

    if (isCorrect) {
      setScore(score + 1)
    }

    setIsAnswerSubmitted(true)
    // We won't show if answer is correct until the end of the quiz
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswerSubmitted(false)
    } else {
      setIsQuizCompleted(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Quiz not found</p>
        </CardContent>
      </Card>
    )
  }

  if (isQuizCompleted) {
    const percentage = Math.round((score / quiz.questions.length) * 100)

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quiz Completed</CardTitle>
          <CardDescription>{quiz.title}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6 p-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold">
              Your Score: {score}/{quiz.questions.length}
            </h3>
            <p className="text-muted-foreground">
              {percentage}% -{" "}
              {percentage >= 80
                ? "Excellent!"
                : percentage >= 60
                  ? "Good job!"
                  : percentage >= 40
                    ? "Not bad!"
                    : "Keep practicing!"}
            </p>
          </div>
          <Progress value={percentage} className="w-full" />
        </CardContent>
        <CardFooter className="flex justify-center p-6">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardFooter>
      </Card>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <Progress value={(currentQuestionIndex / quiz.questions.length) * 100} className="mt-2" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
          </div>
          <RadioGroup value={selectedAnswer?.toString()} className="space-y-3">
            {currentQuestion.options.map((option: string, index: number) => (
              <div
                key={index}
                className={`flex items-center space-x-2 rounded-lg border p-4 ${
                  isAnswerSubmitted && selectedAnswer === index ? "border-primary bg-primary/10" : ""
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={isAnswerSubmitted} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
                {/* Remove the CheckCircle and AlertCircle icons that show correct/incorrect answers */}
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between p-6">
          {!isAnswerSubmitted ? (
            <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null} className="w-full">
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="w-full">
              {currentQuestionIndex < quiz.questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
