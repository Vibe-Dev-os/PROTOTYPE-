import type { Metadata } from "next"
import FeedbackForm from "@/components/feedback-form"

export const metadata: Metadata = {
  title: "Anonymous Feedback | AcadGuide",
  description: "Submit anonymous feedback, concerns, or suggestions",
}

export default function FeedbackPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 bg-[#0F0A1A]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">Anonymous Feedback</h1>
        <p className="text-muted-foreground text-gray-400">
          Share your thoughts, concerns, or suggestions without revealing your identity.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="bg-[#1A1525] border border-[#2D2A3D] rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold text-white mb-2">About Anonymous Feedback</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>
              Your identity is <span className="text-violet-400 font-medium">never recorded</span> when submitting
              feedback
            </li>
            <li>Feedback is used to improve courses, teaching methods, and the overall learning experience</li>
            <li>Be constructive and specific to help us address your concerns effectively</li>
            <li>
              For urgent matters requiring immediate attention, please contact your instructor or department directly
            </li>
          </ul>
        </div>

        <FeedbackForm />
      </div>
    </div>
  )
}
