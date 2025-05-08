"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, FileText, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getData } from "@/lib/data-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FlashcardsPage() {
  const [flashcardSets, setFlashcardSets] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredSets, setFilteredSets] = useState<any[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const flashcardsData = (await getData("flashcards")) as any[]
        const coursesData = (await getData("courses")) as any[]
        const departmentsData = (await getData("departments")) as any[]

        setFlashcardSets(flashcardsData)
        setFilteredSets(flashcardsData)
        setCourses(coursesData)
        setDepartments(departmentsData)
      } catch (error) {
        console.error("Error fetching flashcards:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    filterFlashcardSets()
  }, [searchQuery, selectedDepartment, flashcardSets])

  const filterFlashcardSets = () => {
    let filtered = [...flashcardSets]

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (set) => set.title.toLowerCase().includes(query) || set.description.toLowerCase().includes(query),
      )
    }

    // Filter by department
    if (selectedDepartment !== "all") {
      filtered = filtered.filter((set) => {
        const course = getCourseById(set.courseId)
        return course && course.departmentId === selectedDepartment
      })
    }

    setFilteredSets(filtered)
  }

  const getCourseById = (courseId: string) => {
    return courses.find((course) => course.id === courseId)
  }

  const getDepartmentById = (departmentId: string) => {
    return departments.find((dept) => dept.id === departmentId)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Flashcards</h1>
          <p className="text-muted-foreground">Practice with interactive flashcards</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search flashcards..."
            className="w-full pl-8 md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Filter by Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.code} - {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSets.length > 0 ? (
          filteredSets.map((set) => {
            const course = getCourseById(set.courseId)
            const department = course ? getDepartmentById(course.departmentId) : null

            return (
              <Card key={set.id} className="overflow-hidden">
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{set.title}</CardTitle>
                  </div>
                  <CardDescription className="mt-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>
                      {course?.code} - {course?.name}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Badge variant="outline">{department?.code || "Unknown Department"}</Badge>
                    <p className="mt-2 text-sm text-muted-foreground">{set.description}</p>
                    <p className="mt-1 text-sm font-medium">
                      {set.cards.length} {set.cards.length === 1 ? "card" : "cards"}
                    </p>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/student/flashcards/${set.id}`}>Start Practice</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            {searchQuery || selectedDepartment !== "all"
              ? "No flashcard sets match your search criteria"
              : "No flashcard sets available"}
          </div>
        )}
      </div>
    </div>
  )
}
