import { SubjectForm } from "@/components/subject-form"

export default function CreateSubjectPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Subject</h1>
        <p className="text-muted-foreground">Create a new subject for this department</p>
      </div>
      <SubjectForm departmentId={params.id} />
    </div>
  )
}
