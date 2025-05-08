"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getFeedback, updateFeedbackStatus, type Feedback } from "@/lib/data-utils"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function InstructorFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const data = await getFeedback()
        setFeedback(data || [])
      } catch (error) {
        console.error("Error loading feedback:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeedback()
  }, [])

  const handleStatusUpdate = async (id: string, status: "pending" | "reviewed" | "addressed") => {
    try {
      await updateFeedbackStatus(id, status)

      // Update local state
      setFeedback((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))

      toast({
        title: "Status updated",
        description: `Feedback has been marked as ${status}`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error updating feedback status:", error)
      toast({
        title: "Error",
        description: "Failed to update feedback status",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-900/20 text-yellow-400 border-yellow-400">
            Pending
          </Badge>
        )
      case "reviewed":
        return (
          <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-400">
            Reviewed
          </Badge>
        )
      case "addressed":
        return (
          <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-400">
            Addressed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "concern":
        return "Concern"
      case "improvement":
        return "Improvement"
      case "praise":
        return "Praise"
      case "evaluation":
        return "Evaluation"
      case "other":
        return "Other"
      default:
        return "Feedback"
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "concern":
        return <Badge className="bg-red-900/20 text-red-400 border-red-400">Concern</Badge>
      case "improvement":
        return <Badge className="bg-blue-900/20 text-blue-400 border-blue-400">Improvement</Badge>
      case "praise":
        return <Badge className="bg-green-900/20 text-green-400 border-green-400">Praise</Badge>
      case "evaluation":
        return <Badge className="bg-purple-900/20 text-purple-400 border-purple-400">Evaluation</Badge>
      case "other":
        return <Badge className="bg-gray-900/20 text-gray-400 border-gray-400">Other</Badge>
      default:
        return <Badge>Feedback</Badge>
    }
  }

  const pendingFeedback = feedback.filter((item) => item.status === "pending")
  const reviewedFeedback = feedback.filter((item) => item.status === "reviewed")
  const addressedFeedback = feedback.filter((item) => item.status === "addressed")

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-8 bg-[#0F0A1A]">
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">Student Feedback</h1>
          <p className="text-muted-foreground text-gray-400">Review anonymous feedback from students</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Loading feedback...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 bg-[#0F0A1A]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">Student Feedback</h1>
        <p className="text-muted-foreground text-gray-400">Review anonymous feedback from students</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-[#1A1525] border-[#2D2A3D]">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-violet-900/30 data-[state=active]:text-violet-300"
          >
            Pending ({pendingFeedback.length})
          </TabsTrigger>
          <TabsTrigger
            value="reviewed"
            className="data-[state=active]:bg-violet-900/30 data-[state=active]:text-violet-300"
          >
            Reviewed ({reviewedFeedback.length})
          </TabsTrigger>
          <TabsTrigger
            value="addressed"
            className="data-[state=active]:bg-violet-900/30 data-[state=active]:text-violet-300"
          >
            Addressed ({addressedFeedback.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-violet-900/30 data-[state=active]:text-violet-300">
            All ({feedback.length})
          </TabsTrigger>
        </TabsList>

        {["pending", "reviewed", "addressed", "all"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            {feedback.length === 0 || (tab !== "all" && feedback.filter((item) => item.status === tab).length === 0) ? (
              <div className="flex flex-col items-center justify-center h-64 bg-[#1A1525] border border-[#2D2A3D] rounded-lg">
                <p className="text-gray-400 mb-2">No {tab !== "all" ? tab : ""} feedback available</p>
                <p className="text-sm text-gray-500">Feedback submitted by students will appear here</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {(tab === "all" ? feedback : feedback.filter((item) => item.status === tab))
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((item) => (
                    <Card key={item.id} className="bg-[#1A1525] border-[#2D2A3D]">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white">{item.subject}</CardTitle>
                            <CardDescription className="text-gray-400">
                              {new Date(item.timestamp).toLocaleDateString()} • {getTypeLabel(item.type)}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            {getTypeBadge(item.type)}
                            {getStatusBadge(item.status)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <p className="text-gray-300 whitespace-pre-wrap">{item.message}</p>
                        </div>

                        {item.departmentId && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-400">Department: </span>
                            <span className="text-sm text-gray-300">{item.departmentId.toUpperCase()}</span>
                          </div>
                        )}

                        <div className="mt-4 flex justify-end space-x-2">
                          {item.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-blue-900/20 text-blue-400 border-blue-400 hover:bg-blue-900/40"
                              onClick={() => handleStatusUpdate(item.id, "reviewed")}
                            >
                              <Clock className="mr-1 h-4 w-4" />
                              Mark as Reviewed
                            </Button>
                          )}

                          {(item.status === "pending" || item.status === "reviewed") && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-green-900/20 text-green-400 border-green-400 hover:bg-green-900/40"
                              onClick={() => handleStatusUpdate(item.id, "addressed")}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Mark as Addressed
                            </Button>
                          )}

                          {item.status === "addressed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-yellow-900/20 text-yellow-400 border-yellow-400 hover:bg-yellow-900/40"
                              onClick={() => handleStatusUpdate(item.id, "pending")}
                            >
                              <AlertCircle className="mr-1 h-4 w-4" />
                              Reopen
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
