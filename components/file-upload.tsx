"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, File, X, FileText, ImageIcon, Film, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

interface FileUploadProps {
  onFileUpload: (files: File[]) => void
  acceptedFileTypes?: string
  maxFiles?: number
  maxSizeMB?: number
  existingFiles?: Array<{ name: string; url: string; type: string; size: number }>
  onFileDelete?: (fileName: string) => void
}

export function FileUpload({
  onFileUpload,
  acceptedFileTypes = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.mp4,.mp3",
  maxFiles = 5,
  maxSizeMB = 10,
  existingFiles = [],
  onFileDelete,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    processFiles(selectedFiles)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }

  const processFiles = (selectedFiles: File[]) => {
    // Check if adding these files would exceed the max number
    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        variant: "destructive",
        title: "Too many files",
        description: `You can only upload a maximum of ${maxFiles} files.`,
      })
      return
    }

    // Filter files by size and type
    const validFiles = selectedFiles.filter((file) => {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `${file.name} exceeds the maximum file size of ${maxSizeMB}MB.`,
        })
        return false
      }

      // Check file type
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
      if (!acceptedFileTypes.includes(fileExtension)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: `${file.name} is not an accepted file type.`,
        })
        return false
      }

      return true
    })

    if (validFiles.length > 0) {
      // Simulate upload progress
      validFiles.forEach((file) => {
        simulateUploadProgress(file.name)
      })

      setFiles((prevFiles) => [...prevFiles, ...validFiles])
      onFileUpload(validFiles)
    }
  }

  const simulateUploadProgress = (fileName: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress((prev) => ({ ...prev, [fileName]: progress }))
      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 200)
  }

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
    if (onFileDelete) {
      onFileDelete(fileName)
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (extension === "pdf") return <FileText className="h-5 w-5 text-red-500" />
    if (["doc", "docx"].includes(extension || "")) return <FileText className="h-5 w-5 text-blue-500" />
    if (["xls", "xlsx"].includes(extension || "")) return <FileText className="h-5 w-5 text-green-500" />
    if (["ppt", "pptx"].includes(extension || "")) return <FileText className="h-5 w-5 text-orange-500" />
    if (["jpg", "jpeg", "png", "gif"].includes(extension || ""))
      return <ImageIcon className="h-5 w-5 text-purple-500" />
    if (["mp4", "mov", "avi"].includes(extension || "")) return <Film className="h-5 w-5 text-pink-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-4">
      <div
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
        <p className="mb-1 text-sm font-medium">Drag and drop files here or click to browse</p>
        <p className="text-xs text-muted-foreground">
          Accepted file types: {acceptedFileTypes} (Max: {maxFiles} files, {maxSizeMB}MB each)
        </p>
        <Button variant="outline" className="mt-4" onClick={() => fileInputRef.current?.click()} type="button">
          Browse Files
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept={acceptedFileTypes}
          onChange={handleFileChange}
        />
      </div>

      {/* Existing files */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Existing Files</h4>
          <div className="space-y-2">
            {existingFiles.map((file, index) => (
              <div key={`existing-${index}`} className="flex items-center justify-between rounded-md border p-2">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.name)}
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={file.url} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  {onFileDelete && (
                    <Button variant="ghost" size="icon" onClick={() => removeFile(file.name)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Newly uploaded files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border p-2">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.name)}
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {uploadProgress[file.name] < 100 ? (
                    <Progress value={uploadProgress[file.name]} className="h-1 w-20" />
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    >
                      Uploaded
                    </Badge>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => removeFile(file.name)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
