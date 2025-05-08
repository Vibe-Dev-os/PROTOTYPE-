"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getData } from "@/lib/data-utils"
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, Trophy, Users, Map } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface FlashcardGameProps {
  flashcardSetId: string
}

export function FlashcardGame({ flashcardSetId }: FlashcardGameProps) {
  const [flashcardSet, setFlashcardSet] = useState<any>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [cards, setCards] = useState<any[]>([])
  const [gameMode, setGameMode] = useState<"practice" | "challenge" | "adventure">("practice")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isGameActive, setIsGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [adventureLevel, setAdventureLevel] = useState(1)
  const [adventureProgress, setAdventureProgress] = useState(0)
  const [opponentProgress, setOpponentProgress] = useState(0)
  const [correctStreak, setCorrectStreak] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const flashcardsData = (await getData("flashcards")) as any[]
        const set = flashcardsData.find((set) => set.id === flashcardSetId)

        if (set) {
          setFlashcardSet(set)
          setCards([...set.cards])
        }
      } catch (error) {
        console.error("Error fetching flashcard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [flashcardSetId])

  // Timer effect for challenge mode
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isGameActive && timeLeft > 0 && gameMode !== "practice") {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameOver(true)
            return 0
          }
          return prev - 1
        })

        // Simulate opponent progress in challenge mode
        if (gameMode === "challenge") {
          setOpponentProgress((prev) => {
            const newProgress = prev + (difficulty === "easy" ? 0.5 : difficulty === "medium" ? 0.3 : 0.2)
            if (newProgress >= 100) {
              setGameOver(true)
              return 100
            }
            return newProgress
          })
        }
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [isGameActive, timeLeft, gameMode, difficulty])

  const startGame = () => {
    shuffleCards()
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setScore(0)
    setCorrectStreak(0)
    setIsGameActive(true)
    setGameOver(false)
    setOpponentProgress(0)
    setAdventureProgress(0)
    setShowAnswer(false)

    // Set time based on mode and difficulty
    if (gameMode === "challenge") {
      setTimeLeft(difficulty === "easy" ? 120 : difficulty === "medium" ? 90 : 60)
    } else if (gameMode === "adventure") {
      setTimeLeft(180) // 3 minutes for adventure mode
    }
  }

  const handleFlip = () => {
    if (gameMode === "practice") {
      setIsFlipped(!isFlipped)
    } else {
      // In challenge and adventure modes, flipping reveals the answer
      if (!isFlipped) {
        setIsFlipped(true)
        setShowAnswer(true)
      }
    }
  }

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
      setShowAnswer(false)
    } else {
      // Cycle back to first card
      setCurrentCardIndex(0)
      setIsFlipped(false)
      setShowAnswer(false)
    }
  }

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
      setShowAnswer(false)
    } else {
      // Cycle to last card
      setCurrentCardIndex(cards.length - 1)
      setIsFlipped(false)
      setShowAnswer(false)
    }
  }

  const handleShuffle = () => {
    shuffleCards()
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setShowAnswer(false)
  }

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
  }

  const handleReset = () => {
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setShowAnswer(false)
  }

  const handleKnowAnswer = () => {
    // User knows the answer
    setScore(score + 1)
    setCorrectStreak(correctStreak + 1)

    if (gameMode === "adventure") {
      const newProgress = Math.min(100, ((score + 1) / 10) * 100)
      setAdventureProgress(newProgress)

      if (newProgress >= 100) {
        // Level complete
        setAdventureLevel((prev) => Math.min(prev + 1, 5))
        setAdventureProgress(0)
        setScore(0)
      }
    }

    handleNext()
  }

  const handleDontKnowAnswer = () => {
    // User doesn't know the answer
    setCorrectStreak(0)
    setIsFlipped(true)
    setShowAnswer(true)
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

  if (!flashcardSet) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Flashcard set not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{flashcardSet.title}</CardTitle>
              <CardDescription>{flashcardSet.description}</CardDescription>
            </div>
            {!isGameActive && !gameOver && (
              <Tabs defaultValue={gameMode} onValueChange={(value) => setGameMode(value as any)} className="w-[400px]">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="practice">Practice</TabsTrigger>
                  <TabsTrigger value="challenge">
                    <Users className="mr-2 h-4 w-4" />
                    Challenge
                  </TabsTrigger>
                  <TabsTrigger value="adventure">
                    <Map className="mr-2 h-4 w-4" />
                    Adventure
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col justify-center p-6">
          {!isGameActive && !gameOver ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">
                  {gameMode === "practice"
                    ? "Practice Mode"
                    : gameMode === "challenge"
                      ? "Challenge Mode"
                      : "Adventure Mode"}
                </h3>
                <p className="text-muted-foreground">
                  {gameMode === "practice"
                    ? "Study at your own pace"
                    : gameMode === "challenge"
                      ? "Race against the clock and an opponent"
                      : "Progress through levels and master the content"}
                </p>
              </div>

              {gameMode !== "practice" && (
                <div className="flex gap-4 my-4">
                  <Button variant={difficulty === "easy" ? "default" : "outline"} onClick={() => setDifficulty("easy")}>
                    Easy
                  </Button>
                  <Button
                    variant={difficulty === "medium" ? "default" : "outline"}
                    onClick={() => setDifficulty("medium")}
                  >
                    Medium
                  </Button>
                  <Button variant={difficulty === "hard" ? "default" : "outline"} onClick={() => setDifficulty("hard")}>
                    Hard
                  </Button>
                </div>
              )}

              <Button onClick={startGame} className="mt-4">
                Start {gameMode === "practice" ? "Studying" : "Game"}
              </Button>
            </div>
          ) : gameOver ? (
            <div className="flex flex-col items-center gap-6 py-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold">Game Over!</h2>
                <p className="text-muted-foreground">
                  {gameMode === "challenge" && opponentProgress >= 100
                    ? "Your opponent won!"
                    : `Your final score: ${score}`}
                </p>
              </div>
              <div className="flex gap-4">
                <Button onClick={startGame}>Play Again</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsGameActive(false)
                    setGameOver(false)
                  }}
                >
                  Change Mode
                </Button>
              </div>
            </div>
          ) : (
            <>
              {gameMode !== "practice" && (
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {gameMode === "challenge" ? "Challenge" : `Level ${adventureLevel}`}
                      </Badge>
                      <div className="text-sm">Score: {score}</div>
                      {correctStreak > 1 && (
                        <Badge variant="secondary" className="ml-2">
                          {correctStreak} streak!
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
                    </div>
                  </div>

                  {gameMode === "challenge" && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>You</span>
                        <span>Opponent</span>
                      </div>
                      <div className="flex gap-2">
                        <Progress value={(score / 15) * 100} className="h-2 flex-1" />
                        <Progress value={opponentProgress} className="h-2 flex-1" />
                      </div>
                    </div>
                  )}

                  {gameMode === "adventure" && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Level Progress</span>
                        <span>{Math.round(adventureProgress)}%</span>
                      </div>
                      <Progress value={adventureProgress} className="h-2" />
                    </div>
                  )}
                </div>
              )}

              <div className="relative w-full max-w-md mx-auto cursor-pointer perspective-1000" onClick={handleFlip}>
                <div
                  className={`relative w-full min-h-[300px] transform-style-3d transition-transform duration-500 ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl border bg-card p-6 backface-hidden">
                    <div className="text-center text-xl font-medium">{cards[currentCardIndex]?.term}</div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl border bg-muted p-6 rotate-y-180 backface-hidden">
                    <div className="text-center">{cards[currentCardIndex]?.definition}</div>
                  </div>
                </div>
              </div>

              {gameMode !== "practice" && showAnswer && (
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    onClick={handleKnowAnswer}
                    variant="outline"
                    className="border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20"
                  >
                    I knew it
                  </Button>
                  <Button
                    onClick={handleNext}
                    variant="outline"
                    className="border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    I didn't know
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 p-6">
          {isGameActive && !gameOver && (
            <>
              {gameMode === "practice" ? (
                <>
                  <div className="flex w-full items-center justify-between">
                    <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentCardIndex === 0}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Card {currentCardIndex + 1} of {cards.length}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNext}
                      disabled={currentCardIndex === cards.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex w-full gap-2">
                    <Button variant="outline" className="flex-1" onClick={handleShuffle}>
                      <Shuffle className="mr-2 h-4 w-4" />
                      Shuffle
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={handleReset}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex w-full gap-2">
                  {!showAnswer && (
                    <Button className="flex-1" onClick={handleDontKnowAnswer}>
                      Show Answer
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1" onClick={() => setGameOver(true)}>
                    End Game
                  </Button>
                </div>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
