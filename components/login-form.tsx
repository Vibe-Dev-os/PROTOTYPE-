"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, GraduationCap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { initializeUserData } from "@/lib/data-utils"
import { SecondaryAuth } from "@/components/secondary-auth"
import { storeUserSecurely } from "@/lib/auth-utils"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [isLoading, setIsLoading] = useState(false)
  const [showSecondaryAuth, setShowSecondaryAuth] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handlePrimarySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate primary authentication
      if (username && password) {
        // In a real app, you would validate credentials against a server
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Show secondary authentication step
        setShowSecondaryAuth(true)
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Please enter both username and password",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSecondaryAuthSuccess = async (userData: any) => {
    setIsLoading(true)

    try {
      // Store user info securely
      storeUserSecurely(userData)

      // Initialize sample data for the app
      await initializeUserData()

      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      })

      // Redirect to dashboard based on role
      router.push(`/dashboard/${userData.role}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Setup failed",
        description: "An error occurred while setting up your account",
      })
      setShowSecondaryAuth(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSecondaryAuthCancel = () => {
    setShowSecondaryAuth(false)
  }

  if (showSecondaryAuth) {
    return (
      <SecondaryAuth
        role={role}
        username={username}
        onSuccess={handleSecondaryAuthSuccess}
        onCancel={handleSecondaryAuthCancel}
      />
    )
  }

  return (
    <Card className="w-full max-w-md bg-[#1A1525] border-[#2D2A3D]">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <BookOpen className="h-10 w-10 text-violet-400" />
        </div>
        <CardTitle className="text-2xl text-center text-white">AcadGuide</CardTitle>
        <CardDescription className="text-center text-gray-400">
          Academic Resource Portal for ZDSPGC Students and Instructors
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handlePrimarySubmit}>
          <div className="grid gap-4">
            <RadioGroup defaultValue="student" className="grid grid-cols-2 gap-4 mb-4" onValueChange={setRole}>
              <div>
                <RadioGroupItem value="student" id="student" className="peer sr-only" />
                <Label
                  htmlFor="student"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-[#3F3A52] bg-[#2D2A3D] p-4 hover:bg-[#3F3A52] hover:text-white peer-data-[state=checked]:border-violet-400 [&:has([data-state=checked])]:border-violet-400 text-white"
                >
                  <GraduationCap className="mb-3 h-6 w-6 text-violet-400" />
                  Student
                </Label>
              </div>
              <div>
                <RadioGroupItem value="instructor" id="instructor" className="peer sr-only" />
                <Label
                  htmlFor="instructor"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-[#3F3A52] bg-[#2D2A3D] p-4 hover:bg-[#3F3A52] hover:text-white peer-data-[state=checked]:border-violet-400 [&:has([data-state=checked])]:border-violet-400 text-white"
                >
                  <BookOpen className="mb-3 h-6 w-6 text-violet-400" />
                  Instructor
                </Label>
              </div>
            </RadioGroup>
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-white">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#2D2A3D] border-[#3F3A52] text-white placeholder:text-gray-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#2D2A3D] border-[#3F3A52] text-white placeholder:text-gray-500"
              />
            </div>
          </div>
          <Button
            className="w-full mt-6 bg-violet-700 hover:bg-violet-600 text-white"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Continue"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-violet-400" />
          <p className="text-xs text-violet-400">Secure Two-Step Authentication</p>
        </div>
        <p className="text-xs text-center text-gray-500">
          This is a secure portal for ZDSPGC members only. You will need your institutional ID to complete login.
        </p>
      </CardFooter>
    </Card>
  )
}
