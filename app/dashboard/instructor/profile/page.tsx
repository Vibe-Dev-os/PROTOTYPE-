import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, BookOpen, FileText, Calendar, Clock, Users } from "lucide-react"

export default function InstructorProfilePage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 bg-[#0F0A1A]">
      <div className="grid gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">My Profile</h1>
          <p className="text-muted-foreground text-gray-400">View and manage your instructor profile information</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-7 md:col-span-2 bg-[#1A1525] border-[#2D2A3D]">
          <CardHeader>
            <CardTitle className="text-white">Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="bg-[#9D4EDD] text-white text-3xl">I</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold text-white">Instructor</h3>
            <p className="text-sm text-gray-400 mb-4">BSIS Department</p>

            <div className="w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Profile Completion</span>
                <span className="text-xs text-[#B668FF]">85%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#2D2A3D]">
                <div className="h-1.5 rounded-full bg-[#9D4EDD]" style={{ width: "85%" }}></div>
              </div>
            </div>

            <div className="w-full mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Content Created</span>
                <span className="text-xs text-[#B668FF]">24 items</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#2D2A3D]">
                <div className="h-1.5 rounded-full bg-[#9D4EDD]" style={{ width: "60%" }}></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              <Badge variant="outline" className="bg-[#2D1F54] text-[#B668FF] border-[#9D4EDD]">
                BSIS Faculty
              </Badge>
              <Badge variant="outline" className="bg-[#2D1F54] text-[#B668FF] border-[#9D4EDD]">
                Content Creator
              </Badge>
              <Badge variant="outline" className="bg-[#2D1F54] text-[#B668FF] border-[#9D4EDD]">
                Senior Educator
              </Badge>
            </div>

            <Button className="w-full mt-6 bg-[#9D4EDD] hover:bg-[#8A3DCB]">Edit Profile</Button>
          </CardContent>
        </Card>

        <div className="col-span-7 md:col-span-5">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-4 bg-[#1A1525] border-[#2D2A3D]">
              <TabsTrigger value="info" className="data-[state=active]:bg-[#2D1F54] data-[state=active]:text-[#B668FF]">
                Info
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="data-[state=active]:bg-[#2D1F54] data-[state=active]:text-[#B668FF]"
              >
                Stats
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="data-[state=active]:bg-[#2D1F54] data-[state=active]:text-[#B668FF]"
              >
                Content
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-[#2D1F54] data-[state=active]:text-[#B668FF]"
              >
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card className="bg-[#1A1525] border-[#2D2A3D]">
                <CardHeader>
                  <CardTitle className="text-white">Personal Information</CardTitle>
                  <CardDescription className="text-gray-400">Update your instructor details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">
                        Full Name
                      </Label>
                      <div className="flex">
                        <User className="mr-2 h-4 w-4 text-gray-400 mt-3" />
                        <Input
                          id="name"
                          defaultValue="Instructor"
                          className="bg-[#2D1F54] border-[#2D2A3D] text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <div className="flex">
                        <Mail className="mr-2 h-4 w-4 text-gray-400 mt-3" />
                        <Input
                          id="email"
                          defaultValue="instructor@example.com"
                          className="bg-[#2D1F54] border-[#2D2A3D] text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-white">
                        Department
                      </Label>
                      <div className="flex">
                        <BookOpen className="mr-2 h-4 w-4 text-gray-400 mt-3" />
                        <Input
                          id="department"
                          defaultValue="BSIS"
                          className="bg-[#2D1F54] border-[#2D2A3D] text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facultyId" className="text-white">
                        Faculty ID
                      </Label>
                      <div className="flex">
                        <Users className="mr-2 h-4 w-4 text-gray-400 mt-3" />
                        <Input
                          id="facultyId"
                          defaultValue="FAC789"
                          className="bg-[#2D1F54] border-[#2D2A3D] text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-white">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      className="min-h-[100px] bg-[#2D1F54] border-[#2D2A3D] text-white"
                      defaultValue="Experienced educator specializing in information systems and web development."
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-[#9D4EDD] hover:bg-[#8A3DCB]">Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card className="bg-[#1A1525] border-[#2D2A3D]">
                <CardHeader>
                  <CardTitle className="text-white">Teaching Statistics</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your teaching metrics and content engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-[#2D1F54] border-[#2D2A3D]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-white">Lessons Created</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-white">15</div>
                          <div className="text-xs text-green-500">+2 this month</div>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-[#1A1525]">
                          <div className="h-1.5 rounded-full bg-[#9D4EDD]" style={{ width: "75%" }}></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#2D1F54] border-[#2D2A3D]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-white">Quizzes Created</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-white">8</div>
                          <div className="text-xs text-green-500">+1 this month</div>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-[#1A1525]">
                          <div className="h-1.5 rounded-full bg-[#9D4EDD]" style={{ width: "40%" }}></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#2D1F54] border-[#2D2A3D]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-white">Student Engagement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-white">87%</div>
                          <div className="text-xs text-green-500">+5% this month</div>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-[#1A1525]">
                          <div className="h-1.5 rounded-full bg-[#9D4EDD]" style={{ width: "87%" }}></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#2D1F54] border-[#2D2A3D]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-white">Average Quiz Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-white">76%</div>
                          <div className="text-xs text-green-500">+3% this month</div>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-[#1A1525]">
                          <div className="h-1.5 rounded-full bg-[#9D4EDD]" style={{ width: "76%" }}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card className="bg-[#1A1525] border-[#2D2A3D]">
                <CardHeader>
                  <CardTitle className="text-white">My Content</CardTitle>
                  <CardDescription className="text-gray-400">Educational materials you've created</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D1F54]">
                          <FileText className="h-4 w-4 text-[#9D4EDD]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Web Development Fundamentals</p>
                        <p className="text-xs text-gray-400">Lesson • 15 students viewed</p>
                        <p className="text-xs text-gray-500">Created 2 weeks ago</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-[#2D1F54] border-[#2D2A3D] text-white hover:bg-[#3D2F64]"
                      >
                        Edit
                      </Button>
                    </div>

                    <Separator className="bg-[#2D2A3D]" />

                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D1F54]">
                          <BookOpen className="h-4 w-4 text-[#9D4EDD]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Database Concepts</p>
                        <p className="text-xs text-gray-400">Flashcards • 12 students studied</p>
                        <p className="text-xs text-gray-500">Created 3 weeks ago</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-[#2D1F54] border-[#2D2A3D] text-white hover:bg-[#3D2F64]"
                      >
                        Edit
                      </Button>
                    </div>

                    <Separator className="bg-[#2D2A3D]" />

                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D1F54]">
                          <Calendar className="h-4 w-4 text-[#9D4EDD]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">BSIT Student Competition</p>
                        <p className="text-xs text-gray-400">Event • 8 students registered</p>
                        <p className="text-xs text-gray-500">Scheduled for 5/7/2025</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-[#2D1F54] border-[#2D2A3D] text-white hover:bg-[#3D2F64]"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="bg-[#1A1525] border-[#2D2A3D]">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-400">Your recent actions and content updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D1F54]">
                          <FileText className="h-4 w-4 text-[#9D4EDD]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Created Lesson: Advanced JavaScript</p>
                        <p className="text-xs text-gray-400">New lesson added to BSIS curriculum</p>
                        <p className="text-xs text-gray-500">Today at 9:15 AM</p>
                      </div>
                    </div>

                    <Separator className="bg-[#2D2A3D]" />

                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D1F54]">
                          <BookOpen className="h-4 w-4 text-[#9D4EDD]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Updated Flashcards: Database Concepts</p>
                        <p className="text-xs text-gray-400">Added 5 new cards</p>
                        <p className="text-xs text-gray-500">Yesterday at 2:30 PM</p>
                      </div>
                    </div>

                    <Separator className="bg-[#2D2A3D]" />

                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D1F54]">
                          <Clock className="h-4 w-4 text-[#9D4EDD]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Graded Quiz: Web Development Basics</p>
                        <p className="text-xs text-gray-400">Average score: 76%</p>
                        <p className="text-xs text-gray-500">2 days ago at 4:45 PM</p>
                      </div>
                    </div>

                    <Separator className="bg-[#2D2A3D]" />

                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D1F54]">
                          <Calendar className="h-4 w-4 text-[#9D4EDD]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Created Event: BSIT Student Competition</p>
                        <p className="text-xs text-gray-400">Scheduled for 5/7/2025</p>
                        <p className="text-xs text-gray-500">3 days ago at 10:20 AM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
