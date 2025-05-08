"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, X, RefreshCw, Trophy, Clock, Users, Map } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Word lists by difficulty
const wordsByDifficulty = {
  easy: [
    { original: "Array", scrambled: "YARR", hint: "A data structure that stores elements in order" },
    { original: "Loop", scrambled: "OPLO", hint: "Repeats a block of code" },
    { original: "Code", scrambled: "EODC", hint: "Instructions for a computer" },
    { original: "Data", scrambled: "AATD", hint: "Information processed by a program" },
    { original: "File", scrambled: "ELIF", hint: "Stored information on a computer" },
  ],
  medium: [
    { original: "Algorithm", scrambled: "MHGLAROIT", hint: "Step-by-step procedure for calculations" },
    { original: "Database", scrambled: "AAETBSAD", hint: "Organized collection of data" },
    { original: "Function", scrambled: "NFCNTUOI", hint: "A block of reusable code" },
    { original: "Variable", scrambled: "AAIBVLER", hint: "Named storage location" },
    { original: "Interface", scrambled: "EAEFCNRTI", hint: "Connection between systems" },
  ],
  hard: [
    { original: "Polymorphism", scrambled: "MHPYOLSRPIMO", hint: "Many forms in OOP" },
    { original: "Recursion", scrambled: "SRREUCION", hint: "Function that calls itself" },
    { original: "Encapsulation", scrambled: "AEPCNASUTLION", hint: "Bundling data with methods" },
    { original: "Asynchronous", scrambled: "ASNHCYOURONS", hint: "Not occurring at the same time" },
    { original: "Serialization", scrambled: "EIASRLIZTAION", hint: "Converting objects to storable format" },
  ],
}

// Adventure mode levels
const adventureLevels = [
  {
    id: 1,
    name: "Beginner's Valley",
    description: "Start your journey with basic programming terms",
    difficulty: "easy",
    requiredScore: 3,
    unlocked: true,
  },
  {
    id: 2,
    name: "Syntax Mountains",
    description: "Climb higher with intermediate challenges",
    difficulty: "medium",
    requiredScore: 7,
    unlocked: false,
  },
  {
    id: 3,
    name: "Algorithm Forest",
    description: "Navigate through complex programming concepts",
    difficulty: "medium",
    requiredScore: 12,
    unlocked: false,
  },
  {
    id: 4,
    name: "Data Structure Peaks",
    description: "Master advanced data structures",
    difficulty: "hard",
    requiredScore: 18,
    unlocked: false,
  },
  {
    id: 5,
    name: "Recursion Abyss",
    description: "The final challenge with the hardest terms",
    difficulty: "hard",
    requiredScore: 25,
    unlocked: false,
  },
]

// Mock opponents for multiplayer
const opponents = [
  { id: 1, name: "Alex", avatar: "/placeholder.svg?height=40&width=40", skill: "beginner" },
  { id: 2, name: "Taylor", avatar: "/placeholder.svg?height=40&width=40", skill: "intermediate" },
  { id: 3, name: "Jordan", avatar: "/placeholder.svg?height=40&width=40", skill: "advanced" },
  { id: 4, name: "Casey", avatar: "/placeholder.svg?height=40&width=40", skill: "expert" },
]

interface WordScrambleProps {
  onClose?: () => void
}

export function WordScrambleGame({ onClose }: WordScrambleProps) {
  const [gameMode, setGameMode] = useState<"solo" | "multiplayer" | "adventure">("solo")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState<boolean | null>(null)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isGameActive, setIsGameActive] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [selectedOpponent, setSelectedOpponent] = useState<number | null>(null)
  const [opponentProgress, setOpponentProgress] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [adventureProgress, setAdventureProgress] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [unlockedLevels, setUnlockedLevels] = useState([1])
  const [showLevelComplete, setShowLevelComplete] = useState(false)

  // Get current words based on difficulty
  const words = wordsByDifficulty[difficulty]

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)

        // Simulate opponent progress in multiplayer mode
        if (gameMode === "multiplayer" && selectedOpponent) {
          const opponent = opponents.find((o) => o.id === selectedOpponent)
          if (opponent) {
            const progressIncrement =
              opponent.skill === "beginner"
                ? 0.5
                : opponent.skill === "intermediate"
                  ? 0.8
                  : opponent.skill === "advanced"
                    ? 1.2
                    : 1.5

            setOpponentProgress((prev) => {
              const newProgress = prev + progressIncrement
              if (newProgress >= 100) {
                // Opponent wins
                setGameOver(true)
                clearInterval(timer)
                return 100
              }
              return newProgress
            })
          }
        }
      }, 1000)
    } else if (timeLeft === 0) {
      setGameOver(true)
    }

    return () => clearInterval(timer)
  }, [isGameActive, timeLeft, gameMode, selectedOpponent])

  // Start game
  const startGame = () => {
    setIsGameActive(true)
    setCurrentIndex(0)
    setScore(0)
    setShowResult(null)
    setUserInput("")
    setGameOver(false)
    setOpponentProgress(0)

    // Set time based on difficulty
    setTimeLeft(difficulty === "easy" ? 60 : difficulty === "medium" ? 45 : 30)

    if (gameMode === "adventure") {
      const level = adventureLevels.find((l) => l.id === currentLevel)
      if (level) {
        setDifficulty(level.difficulty as "easy" | "medium" | "hard")
      }
    }
  }

  // Check answer
  const checkAnswer = () => {
    const isCorrect = userInput.toLowerCase() === words[currentIndex].original.toLowerCase()
    setShowResult(isCorrect)

    if (isCorrect) {
      setScore(score + 1)

      // Update adventure progress
      if (gameMode === "adventure") {
        const level = adventureLevels.find((l) => l.id === currentLevel)
        if (level) {
          const newProgress = Math.min(100, ((score + 1) / level.requiredScore) * 100)
          setAdventureProgress(newProgress)

          // Check if level completed
          if (score + 1 >= level.requiredScore) {
            setShowLevelComplete(true)
            setIsGameActive(false)

            // Unlock next level
            if (currentLevel < adventureLevels.length) {
              setUnlockedLevels((prev) => {
                if (!prev.includes(currentLevel + 1)) {
                  return [...prev, currentLevel + 1]
                }
                return prev
              })
            }
          }
        }
      }
    }

    setTimeout(() => {
      setShowResult(null)
      setUserInput("")
      setShowHint(false)

      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // Cycle back to first word
        setCurrentIndex(0)
      }
    }, 1500)
  }

  // Reset game
  const resetGame = () => {
    setCurrentIndex(0)
    setUserInput("")
    setScore(0)
    setShowResult(null)
    setIsGameActive(false)
    setTimeLeft(60)
    setShowHint(false)
    setGameOver(false)
    setOpponentProgress(0)
  }

  // Advance to next level in adventure mode
  const nextLevel = () => {
    setCurrentLevel((prev) => Math.min(prev + 1, adventureLevels.length))
    setShowLevelComplete(false)
    setAdventureProgress(0)
    setScore(0)
  }

  // Retry current level in adventure mode
  const retryLevel = () => {
    setShowLevelComplete(false)
    setAdventureProgress(0)
    setScore(0)
  }

  return (
    <Card className="w-full bg-[#1A1525] border-[#2D2A3D] text-white">
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-lg md:text-xl">Word Scramble</CardTitle>
            <CardDescription className="text-gray-400">Unscramble computer science terms</CardDescription>
          </div>
          {!isGameActive && !showLevelComplete && (
            <Tabs
              defaultValue={gameMode}
              onValueChange={(value) => setGameMode(value as any)}
              className="w-full md:w-[400px]"
            >
              <TabsList className="grid w-full grid-cols-3 bg-[#0F0A1A]">
                <TabsTrigger
                  value="solo"
                  className="text-xs md:text-sm data-[state=active]:bg-[#2D1F54] data-[state=active]:text-[#B668FF]"
                >
                  <Clock className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden xs:inline">Solo</span>
                </TabsTrigger>
                <TabsTrigger
                  value="multiplayer"
                  className="text-xs md:text-sm data-[state=active]:bg-[#2D1F54] data-[state=active]:text-[#B668FF]"
                >
                  <Users className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden xs:inline">Multiplayer</span>
                </TabsTrigger>
                <TabsTrigger
                  value="adventure"
                  className="text-xs md:text-sm data-[state=active]:bg-[#2D1F54] data-[state=active]:text-[#B668FF]"
                >
                  <Map className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden xs:inline">Adventure</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isGameActive && !showLevelComplete && gameMode === "solo" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-md space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Select Difficulty:</h3>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as any)}>
                  <SelectTrigger className="bg-[#0F0A1A] border-[#2D2A3D] text-white">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1525] border-[#2D2A3D] text-white">
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={startGame} className="w-full bg-[#2D1F54] hover:bg-[#3D2F64] text-white">
                Start Game
              </Button>
            </div>
          </div>
        )}

        {!isGameActive && !showLevelComplete && gameMode === "multiplayer" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-md space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Select Difficulty:</h3>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as any)}>
                  <SelectTrigger className="bg-[#0F0A1A] border-[#2D2A3D] text-white">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1525] border-[#2D2A3D] text-white">
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Select Opponent:</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                  {opponents.map((opponent) => (
                    <div
                      key={opponent.id}
                      className={`flex items-center gap-2 rounded-md border p-2 cursor-pointer ${
                        selectedOpponent === opponent.id ? "border-[#9D4EDD] bg-[#2D1F54]" : "border-[#2D2A3D]"
                      }`}
                      onClick={() => setSelectedOpponent(opponent.id)}
                    >
                      <Avatar>
                        <AvatarImage src={opponent.avatar || "/placeholder.svg"} alt={opponent.name} />
                        <AvatarFallback className="bg-[#2D1F54] text-white">{opponent.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{opponent.name}</div>
                        <div className="text-xs text-gray-400 capitalize">{opponent.skill}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                onClick={startGame}
                className="w-full bg-[#2D1F54] hover:bg-[#3D2F64] text-white"
                disabled={selectedOpponent === null}
              >
                Start Game
              </Button>
            </div>
          </div>
        )}

        {!isGameActive && !showLevelComplete && gameMode === "adventure" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-md space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Select Level:</h3>
                <div className="space-y-2">
                  {adventureLevels.map((level) => (
                    <div
                      key={level.id}
                      className={`flex items-center justify-between rounded-md border p-3 ${
                        unlockedLevels.includes(level.id)
                          ? currentLevel === level.id
                            ? "border-[#9D4EDD] bg-[#2D1F54]"
                            : "cursor-pointer hover:bg-[#0F0A1A] border-[#2D2A3D]"
                          : "opacity-50 cursor-not-allowed border-[#2D2A3D]"
                      }`}
                      onClick={() => {
                        if (unlockedLevels.includes(level.id)) {
                          setCurrentLevel(level.id)
                        }
                      }}
                    >
                      <div>
                        <div className="font-medium">{level.name}</div>
                        <div className="text-xs text-gray-400">{level.description}</div>
                      </div>
                      <Badge
                        variant={
                          level.difficulty === "easy"
                            ? "outline"
                            : level.difficulty === "medium"
                              ? "secondary"
                              : "destructive"
                        }
                        className={
                          level.difficulty === "easy"
                            ? "border-green-500 text-green-400"
                            : level.difficulty === "medium"
                              ? "bg-[#2D1F54] text-[#B668FF]"
                              : "bg-red-900/20 text-red-400"
                        }
                      >
                        {level.difficulty}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={startGame} className="w-full bg-[#2D1F54] hover:bg-[#3D2F64] text-white">
                Start Level
              </Button>
            </div>
          </div>
        )}

        {showLevelComplete && (
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#2D1F54]">
              <Trophy className="h-12 w-12 text-[#B668FF]" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">Level Complete!</h2>
              <p className="text-gray-400">
                You've completed {adventureLevels.find((l) => l.id === currentLevel)?.name}
              </p>
            </div>
            <div className="flex gap-4">
              {currentLevel < adventureLevels.length && (
                <Button onClick={nextLevel} className="bg-[#2D1F54] hover:bg-[#3D2F64] text-white">
                  Next Level
                </Button>
              )}
              <Button
                variant="outline"
                onClick={retryLevel}
                className="bg-[#1A1525] border-[#2D2A3D] text-white hover:bg-[#2D1F54]"
              >
                Retry Level
              </Button>
            </div>
          </div>
        )}

        {isGameActive && !gameOver && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm border-[#2D2A3D]">
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Badge>
                <div className="text-sm">Score: {score}</div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className={`text-sm font-medium ${timeLeft <= 10 ? "text-red-500" : ""}`}>{timeLeft}s</span>
              </div>
            </div>

            {gameMode === "multiplayer" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-[#9D4EDD] text-white">Y</AvatarFallback>
                    </Avatar>
                    <span>You</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{selectedOpponent && opponents.find((o) => o.id === selectedOpponent)?.name}</span>
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={selectedOpponent ? opponents.find((o) => o.id === selectedOpponent)?.avatar : ""}
                        alt="Opponent"
                      />
                      <AvatarFallback className="bg-[#2D1F54] text-white">O</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Progress value={(score / 10) * 100} className="h-2 flex-1" />
                  <Progress value={opponentProgress} className="h-2 flex-1" />
                </div>
              </div>
            )}

            {gameMode === "adventure" && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{adventureLevels.find((l) => l.id === currentLevel)?.name}</span>
                  <span>
                    {score}/{adventureLevels.find((l) => l.id === currentLevel)?.requiredScore} points
                  </span>
                </div>
                <Progress value={adventureProgress} className="h-2" />
              </div>
            )}

            <div className="flex flex-col items-center gap-4">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wider break-all text-center">
                {words[currentIndex].scrambled}
              </div>
              <div className="flex flex-col sm:flex-row w-full max-w-md items-center gap-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your answer here"
                  className={`w-full bg-[#0F0A1A] border-[#2D2A3D] text-white ${
                    showResult === true ? "border-green-500" : showResult === false ? "border-red-500" : ""
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && userInput && showResult === null) {
                      checkAnswer()
                    }
                  }}
                />
                <Button
                  onClick={checkAnswer}
                  disabled={!userInput || showResult !== null}
                  className="w-full sm:w-auto bg-[#2D1F54] hover:bg-[#3D2F64] text-white mt-2 sm:mt-0"
                >
                  Check
                </Button>
              </div>

              {showHint ? (
                <div className="text-sm text-gray-400">
                  <span className="font-medium">Hint:</span> {words[currentIndex].hint}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(true)}
                  className="text-xs text-[#B668FF] hover:bg-[#2D1F54]/20"
                >
                  Show Hint
                </Button>
              )}

              {showResult !== null && (
                <div
                  className={`flex flex-wrap items-center justify-center gap-2 text-sm md:text-base text-center ${showResult ? "text-green-500" : "text-red-500"}`}
                >
                  {showResult ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span>Correct! The answer is {words[currentIndex].original}</span>
                    </>
                  ) : (
                    <>
                      <X className="h-5 w-5" />
                      <span>Incorrect. The answer is {words[currentIndex].original}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {gameOver && (
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#2D1F54]">
              <Trophy className="h-12 w-12 text-[#B668FF]" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">Game Over!</h2>
              <p className="text-gray-400">
                {gameMode === "multiplayer" && opponentProgress >= 100
                  ? `${selectedOpponent && opponents.find((o) => o.id === selectedOpponent)?.name} won!`
                  : `Your final score: ${score}`}
              </p>
            </div>
            <div className="flex gap-4">
              <Button onClick={resetGame} className="bg-[#2D1F54] hover:bg-[#3D2F64] text-white">
                Play Again
              </Button>
              {onClose && (
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="bg-[#1A1525] border-[#2D2A3D] text-white hover:bg-[#2D1F54]"
                >
                  Exit Game
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isGameActive && (
          <Button
            variant="outline"
            onClick={resetGame}
            className="bg-[#1A1525] border-[#2D2A3D] text-white hover:bg-[#2D1F54]"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Game
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
