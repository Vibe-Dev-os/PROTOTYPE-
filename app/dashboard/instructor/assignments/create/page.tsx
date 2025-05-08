"use client"

import { AssignmentForm } from "@/components/assignment-form"

export default function CreateAssignmentPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Create New Assignment or Activity</h1>
      <AssignmentForm />
    </div>
  )
}
