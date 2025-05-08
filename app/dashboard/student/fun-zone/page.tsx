"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Brain, Gamepad2, Lightbulb } from "lucide-react"
import { WordScrambleGame } from "@/components/games/word-scramble"
import { MemoryMatchGame } from "@/components/games/memory-match"

export default function FunZonePage() {
  const [activeGame, setActiveGame] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-6 md:p-8 max-w-7xl">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl font-bold md:text-2xl lg:text-3xl text-white">Fun Zone</h1>
        <p className="text-sm md:text-base text-gray-400">Take a break and learn with these fun activities</p>
      </div>

      {!activeGame ? (
        <Tabs defaultValue="games" className="w-full">
          <TabsList className="mb-4 bg-[#1A1525] w-full">
            <TabsTrigger value="games" className="data-[state=active]:bg-[#2D1F54] data-[state=active]:text-[#B668FF]">
              Learning Games
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-[#2D1F54] data-[state=active]:text-[#B668FF]">
              Study Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="games">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <GameCard
                title="Word Scramble"
                description="Unscramble computer science terms with multiplayer and adventure modes"
                icon={<Brain className="h-8 w-8 text-[#9D4EDD]" />}
                onClick={() => setActiveGame("wordScramble")}
              />
              <GameCard
                title="Memory Match"
                description="Match terms with their definitions across multiple difficulty levels"
                icon={<Lightbulb className="h-8 w-8 text-[#9D4EDD]" />}
                onClick={() => setActiveGame("memoryMatch")}
              />
              <GameCard
                title="Quick Quiz"
                description="Test your knowledge with rapid questions"
                icon={<Gamepad2 className="h-8 w-8 text-[#9D4EDD]" />}
                onClick={() => setActiveGame("quickQuiz")}
              />
            </div>
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <GameCard
                title="Coming Soon"
                description="More study tools are on the way!"
                icon={<Gamepad2 className="h-8 w-8 text-[#9D4EDD]" />}
                onClick={() => {}}
                disabled
              />
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => setActiveGame(null)}
            className="mb-2 md:mb-4 w-full sm:w-auto bg-[#1A1525] border-[#2D2A3D] text-white hover:bg-[#2D1F54]"
          >
            Back to Games
          </Button>

          {activeGame === "wordScramble" && <WordScrambleGame onClose={() => setActiveGame(null)} />}
          {activeGame === "memoryMatch" && <MemoryMatchGame onClose={() => setActiveGame(null)} />}
          {activeGame === "quickQuiz" && <QuickQuizGame onClose={() => setActiveGame(null)} />}
        </div>
      )}
    </div>
  )
}

function GameCard({
  title,
  description,
  icon,
  onClick,
  disabled = false,
}: {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md bg-[#1A1525] border-[#2D2A3D] text-white">
      <CardHeader className="bg-[#2D1F54]/20 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div>{icon}</div>
        </div>
        <CardDescription className="text-gray-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <p className="text-sm text-gray-400">
          Challenge yourself and compete with friends in this interactive learning game.
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full bg-[#2D1F54] hover:bg-[#3D2F64] text-white" onClick={onClick} disabled={disabled}>
          {disabled ? "Coming Soon" : "Play Now"}
        </Button>
      </CardFooter>
    </Card>
  )
}

function QuickQuizGame({ onClose }: { onClose?: () => void }) {
  const [isStarted, setIsStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameOver, setGameOver] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const questions = [
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyperlinks and Text Markup Language",
        "Home Tool Markup Language",
      ],
      answer: 0,
    },
    {
      question: "Which of the following is a JavaScript framework?",
      options: ["Django", "Flask", "React", "Ruby on Rails"],
      answer: 2,
    },
    {
      question: "What is the purpose of CSS?",
      options: [
        "To define the structure of a webpage",
        "To style and layout web pages",
        "To handle server-side logic",
        "To create interactive elements",
      ],
      answer: 1,
    },
    {
      question: "Which of these is NOT a programming paradigm?",
      options: ["Object-Oriented", "Functional", "Procedural", "Alphabetical"],
      answer: 3,
    },
    {
      question: "What does API stand for?",
      options: [
        "Application Programming Interface",
        "Automated Program Integration",
        "Advanced Programming Implementation",
        "Application Process Integration",
      ],
      answer: 0,
    },
  ]

  const startQuiz = () => {
    setIsStarted(true)
    setCurrentQuestion(0)
    setScore(0)
    setTimeLeft(60)
    setGameOver(false)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleAnswerSelect = (index: number) => {
    if (showResult) return

    setSelectedAnswer(index)
    setShowResult(true)

    if (index === questions[currentQuestion].answer) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setGameOver(true)
      }
    }, 1500)
  }

  return (
    <Card className="w-full bg-[#1A1525] border-[#2D2A3D] text-white">
      <CardHeader>
        <CardTitle>Quick Quiz</CardTitle>
        <CardDescription className="text-gray-400">Test your knowledge with rapid questions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isStarted && !gameOver ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-center">
              Answer as many questions as you can in 60 seconds. Ready to test your knowledge?
            </p>
            <Button onClick={startQuiz} className="bg-[#2D1F54] hover:bg-[#3D2F64] text-white">
              Start Quiz
            </Button>
          </div>
        ) : gameOver ? (
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#2D1F54]">
              <Gamepad2 className="h-12 w-12 text-[#B668FF]" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">Quiz Complete!</h2>
              <p className="text-gray-400">
                Your score: {score}/{questions.length}
              </p>
            </div>
            <div className="flex gap-4">
              <Button onClick={startQuiz} className="bg-[#2D1F54] hover:bg-[#3D2F64] text-white">
                Play Again
              </Button>
              {onClose && (
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="bg-[#1A1525] border-[#2D2A3D] text-white hover:bg-[#2D1F54]"
                >
                  Exit Quiz
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between">
              <div>Score: {score}</div>
              <div>
                Question {currentQuestion + 1}/{questions.length}
              </div>
            </div>

            <div className="rounded-lg border border-[#2D2A3D] p-6">
              <h3 className="mb-4 text-lg font-medium">{questions[currentQuestion].question}</h3>
              <div className="space-y-2 md:space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full justify-start text-left text-sm md:text-base py-3 px-4 bg-[#1A1525] border-[#2D2A3D] hover:bg-[#2D1F54] ${
                      showResult && index === questions[currentQuestion].answer
                        ? "border-green-500 bg-green-950/20"
                        : showResult && index === selectedAnswer && index !== questions[currentQuestion].answer
                          ? "border-red-500 bg-red-950/20"
                          : ""
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
