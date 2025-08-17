'use client'
import React, { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Dialog,DialogClose,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { UploadCloud, X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useImageStore } from "@/store/imageStore"
import { PredictResponse } from "@/types"

export default function UploadDialog() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const setImage = useImageStore((s) => s.setImage)
  const setPredictionData = useImageStore((s) => s.setPredictionData)
  const setError = useImageStore((s) => s.setError)

  const router = useRouter()

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  //handle dropping of images in area, with 5MB max size
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const img = acceptedFiles[0]
    if (img && img.size <= 5 * 1024 * 1024) {
      setFile(img)
    } else if (img) {
      alert("Max file size is 5 MB")
    }
  }, [])

  //properties for image dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
    useFsAccessApi: false,
  })

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFile(null)
  }

  //upload image to prediction API and navigate to results
  async function handleUpload() {
    if (!file) return
    setIsUploading(true)

    // Store the image and navigate to loading/scanner page
    setImage(file)
    router.push("/results")

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch("/api/predict", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");

      setPredictionData(data as PredictResponse)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog >
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
            Add your image here, up to 5 MB max.
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
            {!file && (
              <>
                <UploadCloud size={36} color="blue" />
                <p className="mt-2">
                  {isDragActive ? (
                    <span className="text-blue-700">Drop your image here...</span>
                  ) : (
                    <>Drag your file or <span className="text-blue-700 underline cursor-pointer">browse</span></>
                  )}
                </p>
                <p className="text-xs text-gray-700">Max 5 MB files are allowed</p>
              </>
            )}
            {preview && file && (
              <div className="flex flex-col items-center">
                <div className="w-52 relative group">
                  <div className="w-52 h-52 overflow-hidden rounded-md ">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={handleRemove}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow group-hover:opacity-100 opacity-60 transition"
                    aria-label="Remove image"
                    type="button"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="text-xs text-gray-600 mt-2 text-center">{file.name}</div>
              </div>
              
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isUploading}>Cancel</Button>
          </DialogClose>

          <Button 
            onClick={handleUpload} 
            className="bg-blue-800" 
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
