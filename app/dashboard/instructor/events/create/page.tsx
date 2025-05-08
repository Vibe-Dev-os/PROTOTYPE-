"use client"

import { EventForm } from "@/components/event-form"

export default function CreateEventPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Create New Event</h1>
        <p className="text-muted-foreground">Create a new academic event or activity</p>
      </div>
      <EventForm />
    </div>
  )
}
