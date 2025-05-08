"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Trophy, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Card pairs by difficulty
const cardsByDifficulty = {
  easy: [
    { id: 1, term: "HTML", definition: "Markup language for web pages" },
    { id: 2, term: "CSS", definition: "Styling web pages" },
    { id: 3, term: "JavaScript", definition: "Programming language for the web" },
    { id: 4, term: "PHP", definition: "Server-side scripting language" },
    { id: 5, term: "SQL", definition: "Database query language" },
    { id: 6, term: "API", definition: "Application Programming Interface" },
  ],
  medium: [
    { id: 1, term: "React", definition: "JavaScript library for building UIs" },
    { id: 2, term: "Node.js", definition: "JavaScript runtime environment" },
    { id: 3, term: "MongoDB", definition: "NoSQL database program" },
    { id: 4, term: "Redux", definition: "State management library" },
    { id: 5, term: "GraphQL", definition: "Query language for APIs" },
    { id: 6, term: "Docker", definition: "Platform for containerized applications" },
    { id: 7, term: "TypeScript", definition: "Typed superset of JavaScript" },
    { id: 8, term: "Express", definition: "Web application framework for Node.js" },
  ],
  hard: [
    { id: 1, term: "Kubernetes", definition: "Container orchestration system" },
    { id: 2, term: "WebAssembly", definition: "Binary instruction format for a stack-based VM" },
    { id: 3, term: "TensorFlow", definition: "Machine learning framework" },
    { id: 4, term: "Blockchain", definition: "Distributed ledger technology" },
    { id: 5, term: "Microservices", definition: "Software architecture style" },
    { id: 6, term: "Serverless", definition: "Cloud computing execution model" },
    { id: 7, term: "WebRTC", definition: "Real-time communication protocol" },
    { id: 8, term: "OAuth", definition: "Open standard for access delegation" },
    { id: 9, term: "Quantum Computing", definition: "Computing using quantum-mechanical phenomena" },
    { id: 10, term: "Neural Networks", definition: "Computing systems inspired by biological neural networks" },
  ],
}

interface MemoryMatchProps {
  onClose?: () => void
}

export function MemoryMatchGame({ onClose }: MemoryMatchProps) {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const [isPlaying, setIsPlaying] = useState(false)
  const [cards, setCards] = useState<any[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  // Prepare cards for the game
  const prepareCards = () => {
    const selectedCards = cardsByDifficulty[difficulty]

    // Create pairs (term and definition)
    const cardPairs = selectedCards.flatMap((card) => [
      { ...card, type: "term", pairId: card.id },
      { ...card, type: "definition", pairId: card.id },
    ])

    // Shuffle cards
    return cardPairs.sort(() => Math.random() - 0.5)
  }

  // Start game
  const startGame = () => {
    setCards(prepareCards())
    setFlippedIndices([])
    setMatchedPairs([])
    setMoves(0)
    setIsPlaying(true)
    setGameOver(false)

    // Set time based on difficulty
    setTimeLeft(difficulty === "easy" ? 120 : difficulty === "medium" ? 180 : 240)
  }

  // Handle card click
  const handleCardClick = (index: number) => {
    // Ignore if already flipped or matched
    if (flippedIndices.includes(index) || matchedPairs.includes(cards[index].pairId)) {
      return
    }

    // Can't flip more than 2 cards at once
    if (flippedIndices.length === 2) {
      return
    }

    // Flip the card
    const newFlippedIndices = [...flippedIndices, index]
    setFlippedIndices(newFlippedIndices)

    // Check for match if 2 cards are flipped
    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1)

      const [firstIndex, secondIndex] = newFlippedIndices
      const firstCard = cards[firstIndex]
      const secondCard = cards[secondIndex]

      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        // Match found
        setMatchedPairs([...matchedPairs, firstCard.pairId])
        setFlippedIndices([])

        // Check if all pairs are matched
        if (matchedPairs.length + 1 === cardsByDifficulty[difficulty].length) {
          setGameOver(true)
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setFlippedIndices([])
        }, 1000)
      }
    }
  }

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isPlaying && timeLeft > 0 && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameOver(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [isPlaying, timeLeft, gameOver])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-lg md:text-xl">Memory Match</CardTitle>
            <CardDescription>Match terms with their definitions</CardDescription>
          </div>
          {!isPlaying && (
            <div className="w-full md:w-[200px]">
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isPlaying && !gameOver ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-center">
              Match computer science terms with their correct definitions. Test your knowledge and memory!
            </p>
            <Button onClick={startGame}>Start Game</Button>
          </div>
        ) : gameOver ? (
          <div className="flex flex-col items-center gap-4 md:gap-6 py-6 md:py-8">
            <div className="flex h-16 w-16 md:h-24 md:w-24 items-center justify-center rounded-full bg-primary/10">
              <Trophy className="h-8 w-8 md:h-12 md:w-12 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold">Game Over!</h2>
              <p className="text-sm md:text-base text-muted-foreground">
                {matchedPairs.length === cardsByDifficulty[difficulty].length
                  ? `Congratulations! You matched all pairs in ${moves} moves.`
                  : `Time's up! You matched ${matchedPairs.length} out of ${cardsByDifficulty[difficulty].length} pairs.`}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Button onClick={startGame} className="w-full sm:w-auto">
                Play Again
              </Button>
              {onClose && (
                <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                  Exit Game
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Badge>
                <div className="text-sm">Moves: {moves}</div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className={`text-sm font-medium ${timeLeft <= 30 ? "text-red-500" : ""}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>
                  {matchedPairs.length}/{cardsByDifficulty[difficulty].length} pairs
                </span>
              </div>
              <Progress value={(matchedPairs.length / cardsByDifficulty[difficulty].length) * 100} className="h-2" />
            </div>

            <div
              className={`grid gap-2 sm:gap-3 ${
                difficulty === "easy"
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                  : difficulty === "medium"
                    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              }`}
            >
              {cards.map((card, index) => (
                <div
                  key={index}
                  className={`aspect-square cursor-pointer rounded-md border p-1 sm:p-2 flex items-center justify-center transition-all ${
                    flippedIndices.includes(index) || matchedPairs.includes(card.pairId)
                      ? "bg-primary/10 border-primary"
                      : "bg-card hover:bg-accent"
                  }`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="text-center text-xs sm:text-sm overflow-hidden">
                    {flippedIndices.includes(index) || matchedPairs.includes(card.pairId)
                      ? card.type === "term"
                        ? card.term
                        : card.definition
                      : "?"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isPlaying && !gameOver && (
          <Button variant="outline" onClick={() => setGameOver(true)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            End Game
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
