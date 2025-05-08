import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InstructorFeedbackLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 bg-[#0F0A1A]">
      <div className="mb-4">
        <Skeleton className="h-8 w-64 bg-[#2D2A3D]" />
        <Skeleton className="h-4 w-full mt-2 bg-[#2D2A3D]" />
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-[#1A1525] border-[#2D2A3D]">
          <TabsTrigger value="pending" disabled>
            Pending
          </TabsTrigger>
          <TabsTrigger value="reviewed" disabled>
            Reviewed
          </TabsTrigger>
          <TabsTrigger value="addressed" disabled>
            Addressed
          </TabsTrigger>
          <TabsTrigger value="all" disabled>
            All
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-[#1A1525] border-[#2D2A3D]">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <Skeleton className="h-6 w-48 bg-[#2D2A3D]" />
                      <Skeleton className="h-4 w-32 mt-2 bg-[#2D2A3D]" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-5 w-20 bg-[#2D2A3D]" />
                      <Skeleton className="h-5 w-20 bg-[#2D2A3D]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full bg-[#2D2A3D]" />
                  <div className="mt-4 flex justify-end space-x-2">
                    <Skeleton className="h-9 w-36 bg-[#2D2A3D]" />
                    <Skeleton className="h-9 w-36 bg-[#2D2A3D]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
