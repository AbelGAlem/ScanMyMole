'use client'
import React, { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Dialog,DialogClose,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { UploadCloud, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useImageStore } from "@/store/imageStore"

export default function UploadDialog() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const setImage = useImageStore((s) => s.setImage)
  const router = useRouter()

  //clean ip preview
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  //handle dropping of images in area, with 5MB max size
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const img = acceptedFiles[0]
    if (img && img.size <= 5 * 1024 * 1024) {
      setFile(img)
      setPreview(URL.createObjectURL(img))
    } else if (img) {
      alert("Max file size is 5 MB")
    }
  }, [])

  //properties for image dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] }
  })

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFile(null)
    setPreview(null)
  }

  //set image state, close dialog, go to results page
  function handleUpload() {
    //TODO: upload to server
    setImage(file)
    setIsOpen(false)
    router.push("/results")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="px-6 py-5 rounded-full text-white text-lg font-semibold bg-[#690500] border-2 border-[#3D0000]"
        >
          Scan Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="items-start">
          <DialogTitle>Upload Image Here.</DialogTitle>
          <DialogDescription>
            Add your image here, up to 10 MB max.
          </DialogDescription>
        </DialogHeader>

        <div
          {...getRootProps({
            className:
              `outline-dashed outline-blue-500 rounded-md transition-colors cursor-pointer py-6 
              ${isDragActive ? "bg-blue-50 outline-2 outline-offset-2" : ""} 
              ${file ? "outline-green-500" : ""}`
          })}
        >
          <input {...getInputProps()} />

          <div className="grid place-items-center gap-y-1">
            {!preview && (
              <>
                <UploadCloud size={36} color="blue" />
                <p className="mt-2">
                  {isDragActive ? (
                    <span className="text-blue-700">Drop your image here...</span>
                  ) : (
                    <>Drag your file or <span className="text-blue-700 underline cursor-pointer">browse</span></>
                  )}
                </p>
                <p className="text-xs text-gray-700">Max 10 MB files are allowed</p>
              </>
            )}
            {preview && (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-40 rounded-md"
                />
                <button
                  onClick={handleRemove}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow group-hover:opacity-100 opacity-60 transition"
                  aria-label="Remove image"
                  type="button"
                >
                  <X size={16} />
                </button>
                <div className="text-xs text-gray-600 mt-2 text-center">{file?.name}</div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button onClick={handleUpload} className="bg-blue-800" disabled={!file}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
