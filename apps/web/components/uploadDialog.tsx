'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import {Dialog,DialogClose,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { UploadCloud, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useImageStore } from '@/store/imageStore'
import { Localization, PredictResponse, Sex } from '@/types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { LOCALIZATION_OPTIONS } from '@/constants'


export default function UploadDialog() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)

  // optional form fields
  const [sex, setSex] = useState<Sex | ''>('')
  const [age, setAge] = useState<number | ''>('')
  const [localization, setLocalization] = useState<Localization | ''>('')

  const setImage = useImageStore((s) => s.setImage)
  const setPredictionData = useImageStore((s) => s.setPredictionData)
  const setError = useImageStore((s) => s.setError)

  const router = useRouter()

  useEffect(() => {
    if (!file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => {
      URL.revokeObjectURL(url)
    }
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
  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
    useFsAccessApi: false,
  })

  const resetAll = () => {
    setIsUploading(false)
    setFile(null)
    if (inputRef?.current) inputRef.current.value = ''
    setPreviewUrl(null)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    resetAll()
  }

  //stepper navigation
  const goToUpload = () => setStep(2)
  const backToInfo = () => setStep(1)

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

      if (localization) formData.append('localization', localization)
      if (age) formData.append('age', String(age))

      const res = await fetch('/api/predict', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Request failed')

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

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader className="items-start">
          <DialogTitle>
            {step === 1 ? 'Before we scan' : 'Upload image'}
          </DialogTitle>
          <DialogDescription className='text-start'>
            {step === 1
              ? 'Optionally add case information for better accuracy. You can skip this step.'
              : 'Add your image here, up to 5 MB max.'}
          </DialogDescription>
        </DialogHeader>

        {/* Simple step header */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-sm font-medium max-w-72 w-full">
            <button onClick={backToInfo} className={`rounded-full w-6 h-6 grid place-items-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</button>
            <span>Info</span>
            <div className="flex-1 h-px bg-gray-200 mx-2" />
            <button onClick={goToUpload} className={`rounded-full w-6 h-6 grid place-items-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</button>
            <span>Upload</span>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4 mt-2">
            {/* Sex */}
            <div className="space-y-2">
              <Label htmlFor="sex">Sex (optional)</Label>
              <Select value={sex} onValueChange={(v) => setSex(v as Sex)}>
                <SelectTrigger id="sex">
                  <SelectValue placeholder="Select sex (or leave blank)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="unknown">Prefer not to say / Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age */}
            <div className="space-y-2 max-w-1/2">
              <Label htmlFor="age">Age (optional)</Label>
              <Input
                id="age"
                type="number"
                inputMode="numeric"
                min={0}
                max={85}
                placeholder="e.g., 47"
                value={age}
                onChange={(e) => {
                  const val = e.target.value
                  setAge(val === '' ? '' : Number(val))
                }}
              />
            </div>

            {/* Localization */}
            <div className="space-y-2">
              <Label htmlFor="localization">Localization (optional)</Label>
              <Select
                value={localization}
                onValueChange={(v) => setLocalization(v as Localization)}
              >
                <SelectTrigger id="localization">
                  <SelectValue placeholder="Select body site (or leave blank)" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {LOCALIZATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={goToUpload}
                  type="button"
                >
                  Skip
                </Button>
                <Button
                  onClick={goToUpload}
                  type="button"
                  className="bg-blue-800"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <>
            <div
              {...getRootProps({
                className:
                  `outline-dashed outline-blue-500 rounded-md transition-colors cursor-pointer py-10 mt-4
                  ${isDragActive ? 'bg-blue-50 outline-2 outline-offset-2' : ''} 
                  ${file ? 'outline-green-500' : ''}`,
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
                {/* Preivew Image */}
                {file && (
                  <div className="flex flex-col items-center">
                    <div className="relative group w-52">
                      <div className="w-52 h-52 overflow-hidden rounded-md">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const imgEl = e.currentTarget
                              if (file) {
                                const reader = new FileReader()
                                reader.onload = () => {
                                  if (typeof reader.result === 'string') imgEl.src = reader.result
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                          />
                        ) : null}
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

            <DialogFooter className="mt-2">
              <Button onClick={backToInfo} variant="outline" disabled={isUploading}>Back</Button>

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
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
