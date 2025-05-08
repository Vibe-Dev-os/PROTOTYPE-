"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, GraduationCap, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getData } from "@/lib/data-utils"
import { departments as sampleDepartments } from "@/lib/sample-data" // Import sample data directly

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([])
  const [filteredDepartments, setFilteredDepartments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDepartments() {
      try {
        setIsLoading(true)
        setError(null)

        // Try to get departments from IndexedDB
        let departmentsData: any[] = []
        try {
          departmentsData = (await getData("departments")) as any[]
        } catch (dbError) {
          console.warn("Error fetching from IndexedDB, using fallback data:", dbError)
          // Fallback to imported sample data if IndexedDB fails
          departmentsData = sampleDepartments
        }

        // If still no data, use the imported sample data
        if (!departmentsData || departmentsData.length === 0) {
          console.warn("No departments data available, using fallback data")
          departmentsData = sampleDepartments
        }

        setDepartments(departmentsData)
        setFilteredDepartments(departmentsData)
      } catch (error) {
        console.error("Error fetching departments:", error)
        setError("Failed to load departments")

        // Use sample data as fallback
        setDepartments(sampleDepartments)
        setFilteredDepartments(sampleDepartments)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDepartments(departments)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = departments.filter(
        (dept) =>
          dept.name.toLowerCase().includes(query) ||
          dept.code.toLowerCase().includes(query) ||
          dept.description.toLowerCase().includes(query),
      )
      setFilteredDepartments(filtered)
    }
  }, [searchQuery, departments])

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error && (!departments.length || !filteredDepartments.length)) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card className="border-violet-500/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <AlertCircle className="h-16 w-16 text-violet-500/70 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Error Loading Departments</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Academic Departments</h1>
        <p className="mt-2 text-muted-foreground">Browse and explore academic departments</p>
      </div>

      <div className="mb-6 flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Search departments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>

      {filteredDepartments.length === 0 ? (
        <Card className="border-violet-500/20">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <GraduationCap className="h-12 w-12 text-violet-500/70 mb-3" />
            <h3 className="text-xl font-semibold mb-2">No Departments Found</h3>
            <p className="text-muted-foreground">
              No departments match your search criteria. Try a different search term.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDepartments.map((department) => (
            <Card key={department.id} className="overflow-hidden transition-all hover:border-violet-500/30">
              <CardHeader className="bg-violet-500/5 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle>{department.name}</CardTitle>
                </div>
                <CardDescription className="mt-2">{department.code}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <p className="line-clamp-3 text-sm text-muted-foreground">{department.description}</p>
              </CardContent>
              <CardFooter className="bg-background p-6 pt-0">
                <Button asChild className="w-full">
                  <Link href={`/dashboard/student/departments/${department.id}`}>View Department</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
