"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  Users,
  X,
  BrainCircuit,
  GraduationCap,
  Bookmark,
  BarChart,
  Gamepad2,
  User,
  MessageSquare,
  ClipboardList,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "@/components/theme-provider"
import { getUser } from "@/lib/data-utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setIsMounted(true)
    const userData = getUser()
    setUser(userData)

    // Force dark mode
    document.documentElement.classList.add("dark")
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("acadGuideUser")
    window.location.href = "/"
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/dashboard/${user?.role}/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        href: `/dashboard/${user?.role}`,
        icon: LayoutDashboard,
      },
      {
        title: "My Department",
        href: `/dashboard/${user?.role}/departments/${user?.department?.toLowerCase() || "bsis"}`,
        icon: Users,
      },
      {
        title: "All Departments",
        href: `/dashboard/${user?.role}/departments`,
        icon: GraduationCap,
      },
      {
        title: "Lessons",
        href: `/dashboard/${user?.role}/lessons`,
        icon: FileText,
      },
      {
        title: "Events",
        href: `/dashboard/${user?.role}/events`,
        icon: Calendar,
      },
      {
        title: "Flashcards",
        href: `/dashboard/${user?.role}/flashcards`,
        icon: BookOpen,
      },
      {
        title: "Quizzes",
        href: `/dashboard/${user?.role}/quizzes`,
        icon: BrainCircuit,
      },
    ]

    // Add student-specific items
    if (user?.role === "student") {
      return [
        ...baseItems,
        {
          title: "My Bookmarks",
          href: `/dashboard/${user?.role}/bookmarks`,
          icon: Bookmark,
        },
        {
          title: "Fun Zone",
          href: `/dashboard/${user?.role}/fun-zone`,
          icon: Gamepad2,
        },
        {
          title: "My Progress",
          href: `/dashboard/${user?.role}/progress`,
          icon: BarChart,
        },
        {
          title: "Academic Calendar",
          href: `/dashboard/${user?.role}/calendar`,
          icon: Calendar,
        },
        {
          title: "Anonymous Feedback",
          href: `/dashboard/${user?.role}/feedback`,
          icon: MessageSquare,
        },
      ]
    }

    return baseItems
  }

  if (!isMounted) {
    return null
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-violet-900/50 bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden bg-secondary border-violet-900/50">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col bg-background border-r border-violet-900/50">
            <div className="flex items-center border-b border-violet-900/50 pb-4">
              <Link href={`/dashboard/${user?.role}`} className="flex items-center gap-2 font-semibold text-white">
                <BookOpen className="h-6 w-6 text-violet-500" />
                <span>AcadGuide</span>
              </Link>
              <Sheet>
                <SheetTrigger className="ml-auto">
                  <X className="h-5 w-5" />
                </SheetTrigger>
              </Sheet>
            </div>
            <nav className="flex-1 overflow-auto py-4">
              <div className="grid gap-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-violet-900/30 text-violet-300"
                        : "text-gray-300 hover:bg-secondary hover:text-white",
                    )}
                  >
                    <item.icon
                      className={cn("h-4 w-4", pathname === item.href ? "text-violet-300" : "text-gray-400")}
                    />
                    {item.title}
                  </Link>
                ))}
              </div>
            </nav>
            <div className="border-t border-violet-900/50 pt-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-secondary border-violet-900/50 text-white hover:bg-violet-900/50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Link href={`/dashboard/${user?.role}`} className="flex items-center gap-2 font-semibold md:text-lg text-white">
          <BookOpen className="h-6 w-6 text-violet-500" />
          <span className="violet-glow-text">AcadGuide</span>
        </Link>
        <form className="ml-auto flex-1 md:flex-initial" onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-secondary border-violet-900/50 pl-8 text-white md:w-[200px] lg:w-[300px] focus-visible:ring-violet-500 input-violet"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
              <Avatar>
                <AvatarFallback className="bg-violet-600 text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-secondary border-violet-900/50 text-white">
            <div className="flex items-center gap-4 p-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-violet-600 text-white text-xl">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-lg font-medium leading-none">{user?.name || "User"}</p>
                <p className="text-sm capitalize text-gray-400">{user?.role || "user"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-xs text-green-500">Online</span>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-violet-900/50" />

            <div className="p-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col items-center justify-center rounded-md bg-violet-900/50 p-3 hover:bg-violet-800/50 transition-colors cursor-pointer">
                  <BarChart className="h-5 w-5 text-violet-300 mb-1" />
                  <span className="text-xs">My Stats</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-md bg-violet-900/50 p-3 hover:bg-violet-800/50 transition-colors cursor-pointer">
                  <Bookmark className="h-5 w-5 text-violet-300 mb-1" />
                  <span className="text-xs">Bookmarks</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-md bg-violet-900/50 p-3 hover:bg-violet-800/50 transition-colors cursor-pointer">
                  <Gamepad2 className="h-5 w-5 text-violet-300 mb-1" />
                  <span className="text-xs">Games</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-md bg-violet-900/50 p-3 hover:bg-violet-800/50 transition-colors cursor-pointer">
                  <FileText className="h-5 w-5 text-violet-300 mb-1" />
                  <span className="text-xs">Notes</span>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-violet-900/50" />

            <div className="p-2">
              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Profile Completion</span>
                  <span className="text-xs text-violet-300">70%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-violet-900/50">
                  <div className="h-1.5 rounded-full bg-violet-500" style={{ width: "70%" }}></div>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">XP Level</span>
                  <span className="text-xs text-violet-300">420 XP</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-violet-900/50">
                  <div className="h-1.5 rounded-full bg-violet-500" style={{ width: "42%" }}></div>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-violet-900/50" />

            <DropdownMenuItem asChild>
              <button
                className="flex w-full cursor-default items-center hover:bg-violet-900/50"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="mr-2 h-4 w-4 text-violet-300" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4 text-violet-300" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/${user?.role}/profile`}
                className="flex w-full cursor-default items-center hover:bg-violet-900/50"
              >
                <User className="mr-2 h-4 w-4 text-violet-300" />
                <span>Edit Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <button className="flex w-full cursor-default items-center hover:bg-violet-900/50" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4 text-violet-300" />
                <span>Logout</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r border-violet-900/50 bg-background md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <nav className="grid gap-1 px-2 py-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                    pathname === item.href
                      ? "bg-violet-900/30 text-violet-300 font-medium"
                      : "text-gray-300 hover:bg-secondary hover:text-white",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", pathname === item.href ? "text-violet-300" : "text-gray-400")} />
                  {item.title}
                </Link>
              ))}
              {user?.role === "instructor" && (
                <Link
                  href="/dashboard/instructor/assignments"
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
                    pathname.includes("/dashboard/instructor/assignments")
                      ? "bg-violet-900/30 text-violet-300 font-medium"
                      : "text-gray-300 hover:bg-secondary hover:text-white",
                  )}
                >
                  <ClipboardList className="h-4 w-4" />
                  Assignments
                </Link>
              )}
            </nav>
            <div className="mt-auto">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-secondary border-violet-900/50 text-white hover:bg-violet-900/50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto bg-background">{children}</main>
      </div>
    </div>
  )
}
