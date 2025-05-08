import type { Metadata } from "next"
import Link from "next/link"
import { Calendar, FileText, GraduationCap, BrainCircuit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Student Dashboard | AcadGuide",
  description: "Student dashboard for AcadGuide",
}

export default function StudentDashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 bg-[#0F0A1A]">
      <div className="grid gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, Student</h1>
          <p className="text-muted-foreground text-gray-400">
            Here's an overview of your academic resources and upcoming events.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/student/departments">
          <Card className="bg-[#1A1525] border-[#2D2A3D] hover:border-[#9D4EDD] transition-all hover:violet-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-white">Departments</CardTitle>
              <GraduationCap className="h-4 w-4 text-[#9D4EDD]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">6</div>
              <p className="text-xs text-gray-400">Available academic departments</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/student/lessons">
          <Card className="bg-[#1A1525] border-[#2D2A3D] hover:border-[#9D4EDD] transition-all hover:violet-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-white">Lessons</CardTitle>
              <FileText className="h-4 w-4 text-[#9D4EDD]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0+</div>
              <p className="text-xs text-gray-400">Available learning materials</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/student/events">
          <Card className="bg-[#1A1525] border-[#2D2A3D] hover:border-[#9D4EDD] transition-all hover:violet-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-white">Events</CardTitle>
              <Calendar className="h-4 w-4 text-[#9D4EDD]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3</div>
              <p className="text-xs text-gray-400">Upcoming academic events</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/student/flashcards">
          <Card className="bg-[#1A1525] border-[#2D2A3D] hover:border-[#9D4EDD] transition-all hover:violet-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-white">Learning Tools</CardTitle>
              <BrainCircuit className="h-4 w-4 text-[#9D4EDD]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">2</div>
              <p className="text-xs text-gray-400">Interactive learning tools</p>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-[#1A1525] border-[#2D2A3D]">
          <CardHeader>
            <CardTitle className="text-white">Recent Lessons</CardTitle>
            <CardDescription className="text-gray-400">
              Recently added learning materials across departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-40 border rounded-md border-dashed border-[#2D2A3D] text-gray-400">
              No recent lessons available
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-[#1A1525] border-[#2D2A3D]">
          <CardHeader>
            <CardTitle className="text-white">Upcoming Events</CardTitle>
            <CardDescription className="text-gray-400">Academic events and activities coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#9D4EDD]" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none text-white">BSIT Student Competition</p>
                  <p className="text-xs text-gray-400">5/7/2025</p>
                </div>
                <Link href="/dashboard/student/events/1" className="text-xs text-[#B668FF] hover:underline">
                  View
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#9D4EDD]" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none text-white">BPED Student Competition</p>
                  <p className="text-xs text-gray-400">5/12/2025</p>
                </div>
                <Link href="/dashboard/student/events/2" className="text-xs text-[#B668FF] hover:underline">
                  View
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
