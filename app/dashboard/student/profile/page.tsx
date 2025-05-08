import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, BookOpen, Trophy, Medal, Calendar, Clock, Gamepad2 } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 bg-[#0F0A1A]">
      <div className="grid gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">My Profile</h1>
          <p className="text-muted-foreground text-gray-400">
            View and manage your profile information and achievements
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-7 md:col-span-2 bg-[#1A1525] border-[#2D2A3D]">
          <CardHeader>
            <CardTitle className="text-white">Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="bg-[#9D4EDD] text-white text-3xl">S</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold text-white">Student</h3>
            <p className="text-sm text-gray-400 mb-4">BSIS Department</p>

            <div className="w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Profile Completion</span>
                <span className="text-xs text-[#B668FF]">70%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#2D2A3D]">
                <div className="h-1.5 rounded-full bg-[#9D4EDD]" style={{ width: "70%" }}></div>
              </div>
            </div>

            <div className="w-full mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">XP Level</span>
                <span className="text-xs text-[#B668FF]">420 XP</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#2D2A3D]">
                <div className="h-1.5 rounded-full bg-[#9D4EDD]" style={{ width: "42%" }}></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              <Badge variant="outline" className="bg-[#2D1F54] text-[#B668FF] border-[#9D4EDD]">
                BSIS Student
              </Badge>
              <Badge variant="outline" className="bg-[#2D1F54] text-[#B668FF] border-[#9D4EDD]">
                Quiz Master
              </Badge>
              <Badge variant="outline" className="bg-[#2D1F54] text-[#B668FF] border-[#9D4EDD]">
                Game Champion
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
                value="achievements"
                className="data-[state=active]:bg-[#2D1F54] data-[state=active]:text-[#B668FF]"
              >
                Achievements
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
                  <CardDescription className="text-gray-400">Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">
                        Full Name
                      </Label>
                      <div className="flex">
                        <User className="mr-2 h-4 w-4 text-gray-400 mt-3" />
                        <Input id="name" defaultValue="Student" className="bg-[#2D1F54] border-[#2D2A3D] text-white" />
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
                          defaultValue="student@example.com"
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
                      <Label htmlFor="studentId" className="text-white">
                        Student ID
                      </Label>
                      <div className="flex">
                        <Trophy className="mr-2 h-4 w-4 text-gray-400 mt-3" />
                        <Input
                          id="studentId"
                          defaultValue="ST12345"
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
                      defaultValue="I'm a student interested in web development and programming."
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
                  <CardTitle className="text-white">Learning Statistics</CardTitle>
                  <CardDescription className="text-gray-400">Your learning progress and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-[#2D1F54] border-[#2D2A3D]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-white">Quizzes Completed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-white">12</div>
                          <div className="text-xs text-green-500">+3 this week</div>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-[#1A1525]">
                          <div className="h-1.5 rounded-full bg-[#9D4EDD]" style={{ width: "60%" }}></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#2D1F54] border-[#2D2A3D]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-white">Flashcards Studied</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-white">87</div>
                          <div className="text-xs text-green-500">+15 this week</div>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-[#1A1525]">
                          <div className="h-1.5 rounded-full bg-[#9D4EDD]" style={{ width: "75%" }}></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#2D1F54] border-[#2D2A3D]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-white">Games Played</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-white">24</div>
                          <div className="text-xs text-green-500">+5 this week</div>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-[#1A1525]">
                          <div className="h-1.5 rounded-full bg-[#9D4EDD]" style={{ width: "45%" }}></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#2D1F54] border-[#2D2A3D]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-white">Average Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-white">85%</div>
                          <div className="text-xs text-green-500">+2% this week</div>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-[#1A1525]">
                          <div className="h-1.5 rounded-full bg-[#9D4EDD]" style={{ width: "85%" }}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card className="bg-[#1A1525] border-[#2D2A3D]">
                <CardHeader>
                  <CardTitle className="text-white">Achievements</CardTitle>
                  <CardDescription className="text-gray-400">Badges and rewards you've earned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-4 bg-[#2D1F54] rounded-lg border border-[#2D2A3D]">
                      <Medal className="h-10 w-10 text-[#FFD700] mb-2" />
                      <h3 className="text-sm font-medium text-white">Quiz Master</h3>
                      <p className="text-xs text-gray-400 text-center mt-1">Complete 10 quizzes with 80%+ score</p>
                    </div>

                    <div className="flex flex-col items-center p-4 bg-[#2D1F54] rounded-lg border border-[#2D2A3D]">
                      <Gamepad2 className="h-10 w-10 text-[#C0C0C0] mb-2" />
                      <h3 className="text-sm font-medium text-white">Game Champion</h3>
                      <p className="text-xs text-gray-400 text-center mt-1">Win 5 educational games</p>
                    </div>

                    <div className="flex flex-col items-center p-4 bg-[#2D1F54] rounded-lg border border-[#2D2A3D] opacity-50">
                      <BookOpen className="h-10 w-10 text-[#CD7F32] mb-2" />
                      <h3 className="text-sm font-medium text-white">Bookworm</h3>
                      <p className="text-xs text-gray-400 text-center mt-1">Read 20 lessons (12/20)</p>
                    </div>

                    <div className="flex flex-col items-center p-4 bg-[#2D1F54] rounded-lg border border-[#2D2A3D] opacity-50">
                      <Calendar className="h-10 w-10 text-[#CD7F32] mb-2" />
                      <h3 className="text-sm font-medium text-white">Event Enthusiast</h3>
                      <p className="text-xs text-gray-400 text-center mt-1">Attend 5 academic events (2/5)</p>
                    </div>

                    <div className="flex flex-col items-center p-4 bg-[#2D1F54] rounded-lg border border-[#2D2A3D] opacity-50">
                      <Clock className="h-10 w-10 text-[#CD7F32] mb-2" />
                      <h3 className="text-sm font-medium text-white">Consistent Learner</h3>
                      <p className="text-xs text-gray-400 text-center mt-1">Log in for 7 consecutive days (4/7)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="bg-[#1A1525] border-[#2D2A3D]">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-400">Your recent actions and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D1F54]">
                          <Trophy className="h-4 w-4 text-[#9D4EDD]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Completed Quiz: Web Development Basics</p>
                        <p className="text-xs text-gray-400">Score: 85%</p>
                        <p className="text-xs text-gray-500">Today at 10:30 AM</p>
                      </div>
                    </div>

                    <Separator className="bg-[#2D2A3D]" />

                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D1F54]">
                          <Gamepad2 className="h-4 w-4 text-[#9D4EDD]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Played Game: Word Scramble</p>
                        <p className="text-xs text-gray-400">Score: 120 points</p>
                        <p className="text-xs text-gray-500">Yesterday at 3:45 PM</p>
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
                        <p className="text-sm font-medium text-white">Studied Flashcards: Database Concepts</p>
                        <p className="text-xs text-gray-400">15 cards reviewed</p>
                        <p className="text-xs text-gray-500">2 days ago at 5:20 PM</p>
                      </div>
                    </div>

                    <Separator className="bg-[#2D2A3D]" />

                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D1F54]">
                          <Medal className="h-4 w-4 text-[#9D4EDD]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Earned Achievement: Quiz Master</p>
                        <p className="text-xs text-gray-400">Completed 10 quizzes with 80%+ score</p>
                        <p className="text-xs text-gray-500">3 days ago at 11:15 AM</p>
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
