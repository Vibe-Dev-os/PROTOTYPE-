import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function FeedbackLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 bg-[#0F0A1A]">
      <div className="mb-4">
        <Skeleton className="h-8 w-64 bg-[#2D2A3D]" />
        <Skeleton className="h-4 w-full mt-2 bg-[#2D2A3D]" />
      </div>

      <div className="grid gap-4">
        <Skeleton className="h-32 w-full bg-[#2D2A3D]" />

        <Card className="w-full max-w-2xl mx-auto bg-[#1A1525] border-[#2D2A3D]">
          <CardHeader>
            <Skeleton className="h-6 w-48 bg-[#2D2A3D]" />
            <Skeleton className="h-4 w-full mt-2 bg-[#2D2A3D]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-[#2D2A3D]" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full bg-[#2D2A3D]" />
                    <Skeleton className="h-4 w-32 bg-[#2D2A3D]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-[#2D2A3D]" />
              <Skeleton className="h-10 w-full bg-[#2D2A3D]" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-36 bg-[#2D2A3D]" />
              <Skeleton className="h-10 w-full bg-[#2D2A3D]" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-28 bg-[#2D2A3D]" />
              <Skeleton className="h-32 w-full bg-[#2D2A3D]" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-[#2D2A3D] pt-4">
            <Skeleton className="h-10 w-24 bg-[#2D2A3D]" />
            <Skeleton className="h-10 w-36 bg-[#2D2A3D]" />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
