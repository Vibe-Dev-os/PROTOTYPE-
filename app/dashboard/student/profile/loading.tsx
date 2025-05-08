import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ProfileLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 bg-[#0F0A1A]">
      <div className="grid gap-4">
        <div>
          <Skeleton className="h-8 w-48 bg-[#2D2A3D]" />
          <Skeleton className="h-4 w-72 mt-2 bg-[#2D2A3D]" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-7 md:col-span-2 bg-[#1A1525] border-[#2D2A3D]">
          <CardHeader>
            <Skeleton className="h-6 w-24 bg-[#2D2A3D]" />
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Skeleton className="h-24 w-24 rounded-full bg-[#2D2A3D] mb-4" />
            <Skeleton className="h-6 w-32 bg-[#2D2A3D] mb-2" />
            <Skeleton className="h-4 w-24 bg-[#2D2A3D] mb-4" />

            <div className="w-full">
              <div className="flex items-center justify-between mb-1">
                <Skeleton className="h-3 w-24 bg-[#2D2A3D]" />
                <Skeleton className="h-3 w-8 bg-[#2D2A3D]" />
              </div>
              <Skeleton className="h-1.5 w-full bg-[#2D2A3D]" />
            </div>

            <div className="w-full mt-4">
              <div className="flex items-center justify-between mb-1">
                <Skeleton className="h-3 w-16 bg-[#2D2A3D]" />
                <Skeleton className="h-3 w-12 bg-[#2D2A3D]" />
              </div>
              <Skeleton className="h-1.5 w-full bg-[#2D2A3D]" />
            </div>

            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              <Skeleton className="h-6 w-20 rounded-full bg-[#2D2A3D]" />
              <Skeleton className="h-6 w-24 rounded-full bg-[#2D2A3D]" />
              <Skeleton className="h-6 w-28 rounded-full bg-[#2D2A3D]" />
            </div>

            <Skeleton className="h-10 w-full mt-6 bg-[#2D2A3D]" />
          </CardContent>
        </Card>

        <div className="col-span-7 md:col-span-5">
          <Card className="bg-[#1A1525] border-[#2D2A3D]">
            <CardHeader>
              <Skeleton className="h-6 w-48 bg-[#2D2A3D]" />
              <Skeleton className="h-4 w-64 bg-[#2D2A3D]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-20 bg-[#2D2A3D]" />
                  <Skeleton className="h-20 bg-[#2D2A3D]" />
                </div>
                <Skeleton className="h-32 bg-[#2D2A3D]" />
                <div className="flex justify-end">
                  <Skeleton className="h-10 w-32 bg-[#2D2A3D]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
