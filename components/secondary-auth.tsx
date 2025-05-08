"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ShieldCheck } from "lucide-react"
import { verifySecondaryAuth } from "@/lib/auth-utils"

interface SecondaryAuthProps {
  role: string
  username: string
  onSuccess: (userData: any) => void
  onCancel: () => void
}

export function SecondaryAuth({ role, username, onSuccess, onCancel }: SecondaryAuthProps) {
  const [idNumber, setIdNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const result = await verifySecondaryAuth(role, username, idNumber)

      if (result.success) {
        onSuccess(result.userData)
      } else {
        setError(result.message || "Verification failed. Please check your ID and try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Secondary auth error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-[#1A1525] border-[#2D2A3D]">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <ShieldCheck className="h-10 w-10 text-violet-400" />
        </div>
        <CardTitle className="text-2xl text-center text-white">Verify Your Identity</CardTitle>
        <CardDescription className="text-center text-gray-400">
          Please enter your {role === "student" ? "Student" : "Instructor"} ID to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {error && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="idNumber" className="text-white">
                {role === "student" ? "Student ID" : "Instructor ID"}
              </Label>
              <Input
                id="idNumber"
                type="text"
                placeholder={`Enter your ${role === "student" ? "Student" : "Instructor"} ID`}
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="bg-[#2D2A3D] border-[#3F3A52] text-white placeholder:text-gray-500"
                required
              />
              <p className="text-xs text-gray-400">
                This ID should be your official {role === "student" ? "Student" : "Instructor"} ID issued by ZDSPGC
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button className="w-full bg-violet-700 hover:bg-violet-600 text-white" type="submit" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Identity"}
            </Button>
            <Button className="w-full" type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Back
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-xs text-center text-gray-500 mt-2">
          This verification step helps ensure that only authorized ZDSPGC members can access the system.
        </p>
      </CardFooter>
    </Card>
  )
}
